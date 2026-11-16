"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { findAccounts, getAccountEmail } from "./accountEmail";
import { emailConfigured } from "./email";
import { emailResetLink, findResetToken } from "./passwordReset";
import prisma from "./prisma";
import { blockedFor, clearAttempts, clientIp, recordAttempt, waitMessage } from "./rateLimit";

export type RecoveryState = { error?: string; success?: boolean };

// "Forgot password". The answer is the same whether or not the account
// exists, so it can't be used to find out who has an account.
export const requestPasswordReset = async (
  _state: RecoveryState,
  formData: FormData
): Promise<RecoveryState> => {
  const login = String(formData.get("login") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim().slice(0, 200);
  if (!login) return { error: "Enter your username or email address." };

  const ipKey = `forgot:ip:${await clientIp()}`;
  const loginKey = `forgot:login:${login.toLowerCase()}`;
  const wait = Math.max(blockedFor(ipKey, 10), blockedFor(loginKey, 3));
  if (wait) return { error: waitMessage("reset requests", wait) };
  recordAttempt(ipKey, 60);
  recordAttempt(loginKey, 60);

  for (const user of await findAccounts(login)) {
    const email = await getAccountEmail(user.id, user.role);
    if (email && emailConfigured()) {
      try {
        await emailResetLink(user, email);
        continue;
      } catch (err) {
        // Fall through to asking the admins rather than leaving them stuck
        console.log(err);
      }
    }
    // No email to send to: ask the admins, once a day at most
    const open = await prisma.passwordResetRequest.findFirst({
      where: {
        userId: user.id,
        handledAt: null,
        createdAt: { gt: new Date(Date.now() - 24 * 60 * 60_000) },
      },
    });
    if (open) {
      if (contact && !open.contact) {
        await prisma.passwordResetRequest.update({ where: { id: open.id }, data: { contact } });
      }
    } else {
      await prisma.passwordResetRequest.create({ data: { userId: user.id, contact: contact || null } });
    }
  }
  return { success: true };
};

// Sets a new password from an emailed link
export const resetPasswordWithLink = async (
  _state: RecoveryState,
  formData: FormData
): Promise<RecoveryState> => {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) return { error: "Your new password must be at least 8 characters." };
  if (password !== confirm) return { error: "The passwords don't match." };

  const token = await findResetToken(String(formData.get("token") ?? ""));
  if (!token) return { error: "This reset link has expired or was already used. Ask for a new one." };

  const now = new Date();
  // Changing passwordChangedAt signs the account out on every device
  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.userId },
      data: { password: await bcrypt.hash(password, 10), mustChangePassword: false, passwordChangedAt: now },
    }),
    prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: now } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: token.userId, usedAt: null } }),
    prisma.passwordResetRequest.updateMany({
      where: { userId: token.userId, handledAt: null },
      data: { handledAt: now },
    }),
  ]);
  clearAttempts(`signin:user:${token.user.username.toLowerCase()}`);
  redirect("/sign-in?reset=1");
};
