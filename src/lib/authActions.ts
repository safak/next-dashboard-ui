"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAccountEmail } from "./accountEmail";
import { auth, createSession, deleteSession } from "./auth";
import { emailConfigured } from "./email";
import {
  checkEmailCode,
  CODE_COOKIE,
  CODE_MINUTES,
  createEmailCode,
  pendingSignIn,
  resendEmailCode,
} from "./emailCodes";
import prisma from "./prisma";
import {
  blockedFor,
  clearAttempts,
  clientIp,
  recordAttempt,
  waitMessage,
} from "./rateLimit";

// Failed sign-ins allowed per account, and per device/network, every 15 min
const ACCOUNT_LIMIT = 5;
const IP_LIMIT = 20;
const WINDOW_MINUTES = 15;

export type AuthFormState = { error?: string; success?: boolean };

// A student whose registration hasn't been approved has no account yet.
// Only someone who knows the password learns the registration's status.
const registrationStatusMessage = async (username: string, password: string) => {
  const registration = await prisma.studentRegistration.findFirst({
    where: { username, status: { in: ["PENDING", "REJECTED"] } },
    orderBy: { createdAt: "desc" },
  });
  if (registration && (await bcrypt.compare(password, registration.password))) {
    return registration.status === "PENDING"
      ? "Your registration is waiting for approval by the school. Try again once it has been approved."
      : "Your registration was not approved. Please contact the school.";
  }
  return "Incorrect username or password.";
};

export const signIn = async (
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> => {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) {
    return { error: "Enter your username and password." };
  }

  const accountKey = `signin:user:${username.toLowerCase()}`;
  const ipKey = `signin:ip:${await clientIp()}`;
  const wait = Math.max(blockedFor(accountKey, ACCOUNT_LIMIT), blockedFor(ipKey, IP_LIMIT));
  if (wait) return { error: waitMessage("failed sign-in attempts", wait) };

  const user = await prisma.user.findUnique({ where: { username } });
  // Same message either way so usernames can't be probed
  if (!user || !(await bcrypt.compare(password, user.password))) {
    recordAttempt(accountKey, WINDOW_MINUTES);
    recordAttempt(ipKey, WINDOW_MINUTES);
    return { error: await registrationStatusMessage(username, password) };
  }

  clearAttempts(accountKey);

  // Two-step sign-in: the password was right, now prove access to the email
  if (user.twoFactorEnabled) {
    const email = await getAccountEmail(user.id, user.role);
    if (!email || !emailConfigured()) {
      return {
        error:
          "Your account needs a sign-in code, but it can't be emailed right now. Contact the school office.",
      };
    }
    let codeId: string;
    try {
      codeId = await createEmailCode(user.id, "LOGIN", email);
    } catch (err) {
      console.log(err);
      return { error: "The sign-in code couldn't be emailed. Please try again in a moment." };
    }
    (await cookies()).set(CODE_COOKIE, codeId, {
      httpOnly: true,
      secure: (await headers()).get("x-forwarded-proto") === "https",
      sameSite: "lax",
      path: "/",
      maxAge: CODE_MINUTES * 60 * 4,
    });
    redirect("/sign-in/verify");
  }

  await finishSignIn(user);
  return {};
};

const finishSignIn = async (user: { id: string; role: string; mustChangePassword: boolean }) => {
  await createSession(user.id, user.role, user.mustChangePassword);
  redirect(user.mustChangePassword ? "/profile" : `/${user.role}`);
};

export const verifySignInCode = async (
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> => {
  const ipKey = `signin-code:ip:${await clientIp()}`;
  const wait = blockedFor(ipKey, IP_LIMIT);
  if (wait) return { error: waitMessage("wrong codes", wait) };

  const row = await pendingSignIn();
  if (!row) return { error: "This sign-in has expired. Go back and sign in again." };

  const problem = await checkEmailCode(row, String(formData.get("code") ?? ""));
  if (problem) {
    recordAttempt(ipKey, WINDOW_MINUTES);
    return { error: problem };
  }

  await prisma.emailCode.delete({ where: { id: row.id } });
  (await cookies()).delete(CODE_COOKIE);
  const user = await prisma.user.findUnique({ where: { id: row.userId } });
  if (!user) return { error: "This account no longer exists." };
  await finishSignIn(user);
  return {};
};

export const resendSignInCode = async (): Promise<AuthFormState> => {
  const row = await pendingSignIn();
  if (!row) return { error: "This sign-in has expired. Go back and sign in again." };
  try {
    const problem = await resendEmailCode(row);
    return problem ? { error: problem } : { success: true };
  } catch (err) {
    console.log(err);
    return { error: "The code couldn't be emailed. Please try again in a moment." };
  }
};

export const signOut = async () => {
  await deleteSession();
  redirect("/sign-in");
};

export const changePassword = async (
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> => {
  const { userId, role } = await auth();
  if (!userId || !role) return { error: "You are signed out." };

  const attemptsKey = `password:user:${userId}`;
  const wait = blockedFor(attemptsKey, ACCOUNT_LIMIT);
  if (wait) return { error: waitMessage("wrong current passwords", wait) };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (next !== confirm) return { error: "New passwords don't match." };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(current, user.password))) {
    recordAttempt(attemptsKey, WINDOW_MINUTES);
    return { error: "Current password is incorrect." };
  }
  if (await bcrypt.compare(next, user.password)) {
    return { error: "Choose a password different from your current one." };
  }
  clearAttempts(attemptsKey);

  // Bumping passwordChangedAt signs out every other device; this one gets
  // a fresh session
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: await bcrypt.hash(next, 10),
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });
  await createSession(userId, role);

  if (user.mustChangePassword) redirect(`/${role}`);
  return { success: true };
};
