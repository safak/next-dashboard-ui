"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { EMAIL_PATTERN, setAccountEmail } from "./accountEmail";
import { auth } from "./auth";
import { emailConfigured } from "./email";
import { checkEmailCode, createEmailCode, resendEmailCode } from "./emailCodes";
import prisma from "./prisma";
import { blockedFor, clearAttempts, recordAttempt, waitMessage } from "./rateLimit";

// Profile: confirm an email address with a code, then save it (EMAIL) or
// save it and switch two-step sign-in on (ENABLE)

export type EmailCodeState = { error?: string; sent?: boolean; done?: boolean; email?: string };

type Mode = "ENABLE" | "EMAIL";
const modeOf = (formData: FormData): Mode =>
  formData.get("mode") === "ENABLE" ? "ENABLE" : "EMAIL";

// Same lockout as changing a password: 5 wrong passwords per 15 minutes
const checkPassword = async (userId: string, password: string) => {
  const key = `password:user:${userId}`;
  const wait = blockedFor(key, 5);
  if (wait) return waitMessage("wrong passwords", wait);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    recordAttempt(key, 15);
    return "Your password is incorrect.";
  }
  clearAttempts(key);
  return null;
};

export const startEmailCode = async (
  _state: EmailCodeState,
  formData: FormData
): Promise<EmailCodeState> => {
  const { userId, role } = await auth();
  if (!userId || !role) return { error: "You are signed out." };
  if (!emailConfigured()) return { error: "Email isn't set up for this school yet. Ask an admin." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return { error: "Enter a valid email address." };

  const problem = await checkPassword(userId, String(formData.get("password") ?? ""));
  if (problem) return { error: problem };

  try {
    await createEmailCode(userId, modeOf(formData), email);
  } catch (err) {
    console.log(err);
    return { error: "The code couldn't be emailed. Check the address and try again." };
  }
  return { sent: true, email };
};

export const resendProfileCode = async (
  _state: EmailCodeState,
  formData: FormData
): Promise<EmailCodeState> => {
  const { userId } = await auth();
  if (!userId) return { error: "You are signed out." };
  const row = await prisma.emailCode.findFirst({ where: { userId, purpose: modeOf(formData) } });
  if (!row) return { error: "Start again: the code has expired." };
  try {
    const problem = await resendEmailCode(row);
    return problem ? { error: problem, sent: true, email: row.email } : { sent: true, email: row.email };
  } catch (err) {
    console.log(err);
    return { error: "The code couldn't be emailed. Try again in a moment.", sent: true, email: row.email };
  }
};

export const confirmEmailCode = async (
  _state: EmailCodeState,
  formData: FormData
): Promise<EmailCodeState> => {
  const { userId, role } = await auth();
  if (!userId || !role) return { error: "You are signed out." };
  const mode = modeOf(formData);

  const row = await prisma.emailCode.findFirst({ where: { userId, purpose: mode } });
  if (!row) return { error: "Start again: the code has expired." };
  const problem = await checkEmailCode(row, String(formData.get("code") ?? ""));
  if (problem) return { error: problem, sent: true, email: row.email };

  if (!(await setAccountEmail(userId, role, row.email))) {
    await prisma.emailCode.delete({ where: { id: row.id } });
    return { error: "Another account already uses that email address. Use a different one." };
  }
  await prisma.emailCode.delete({ where: { id: row.id } });
  if (mode === "ENABLE") {
    await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
  }
  revalidatePath("/profile");
  return { done: true };
};

export const disableTwoFactor = async (
  _state: EmailCodeState,
  formData: FormData
): Promise<EmailCodeState> => {
  const { userId } = await auth();
  if (!userId) return { error: "You are signed out." };
  const problem = await checkPassword(userId, String(formData.get("password") ?? ""));
  if (problem) return { error: problem };
  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: false } });
  revalidatePath("/profile");
  return { done: true };
};
