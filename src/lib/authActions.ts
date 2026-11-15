"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth, createSession, deleteSession } from "./auth";
import prisma from "./prisma";

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

  const user = await prisma.user.findUnique({ where: { username } });
  // Same message either way so usernames can't be probed
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: await registrationStatusMessage(username, password) };
  }

  await createSession(user.id, user.role);
  redirect(`/${user.role}`);
};

export const signOut = async () => {
  await deleteSession();
  redirect("/");
};

export const changePassword = async (
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> => {
  const { userId } = await auth();
  if (!userId) return { error: "You are signed out." };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (next !== confirm) return { error: "New passwords don't match." };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(current, user.password))) {
    return { error: "Current password is incorrect." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(next, 10) },
  });
  return { success: true };
};
