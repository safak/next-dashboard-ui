import "server-only";
import { createHash, randomBytes } from "crypto";
import { appUrl, sendEmail } from "./email";
import prisma from "./prisma";
import { getSettings } from "./schoolSettings";

export const RESET_LINK_MINUTES = 30;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// Emails a one-time reset link, replacing any earlier unused link
export const emailResetLink = async (user: { id: string; username: string }, email: string) => {
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
  const token = randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_LINK_MINUTES * 60_000),
    },
  });

  const { schoolName } = await getSettings();
  const link = `${await appUrl()}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: `Reset your ${schoolName} password`,
    text: [
      `Someone asked to reset the password for the account "${user.username}".`,
      "",
      "Choose a new password here:",
      link,
      "",
      `The link works once and expires in ${RESET_LINK_MINUTES} minutes.`,
      "If you didn't ask for this, ignore this email: your password stays the same.",
      "",
      schoolName,
    ].join("\n"),
  });
};

// The unused, unexpired reset link with this token, if there is one
export const findResetToken = (token: string) =>
  token
    ? prisma.passwordResetToken.findFirst({
        where: { tokenHash: hashToken(token), usedAt: null, expiresAt: { gt: new Date() } },
        include: { user: { select: { id: true, username: true } } },
      })
    : null;
