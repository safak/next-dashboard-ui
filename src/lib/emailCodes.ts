import "server-only";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import type { EmailCode } from "@prisma/client";
import { cookies } from "next/headers";
import { sendEmail } from "./email";
import prisma from "./prisma";
import { getSettings } from "./schoolSettings";

// 6-digit codes emailed for two-step sign-in (LOGIN), and to prove an
// address belongs to the user before it is saved (ENABLE turns two-step
// sign-in on as well; EMAIL only changes the address)
export type CodePurpose = "LOGIN" | "ENABLE" | "EMAIL";

export const CODE_MINUTES = 10;
export const MAX_CODE_ATTEMPTS = 5;
export const MAX_CODE_SENDS = 4;
export const RESEND_SECONDS = 30;

// Holds the id of the code emailed to this device during sign-in
export const CODE_COOKIE = "signin_code";

// The sign-in on this device that is waiting for its code, if any
export const pendingSignIn = async () => {
  const id = (await cookies()).get(CODE_COOKIE)?.value;
  return id ? prisma.emailCode.findFirst({ where: { id, purpose: "LOGIN" } }) : null;
};

const hashCode = (id: string, code: string) =>
  createHmac("sha256", process.env.AUTH_SECRET ?? "").update(`${id}:${code}`).digest("hex");

const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

const mailCode = async (email: string, code: string, purpose: CodePurpose) => {
  const { schoolName } = await getSettings();
  const what =
    purpose === "LOGIN"
      ? "Use this code to finish signing in"
      : "Use this code to confirm your email address";
  await sendEmail({
    to: email,
    subject: `${code} is your ${schoolName} code`,
    text: [
      `${what}:`,
      "",
      `    ${code}`,
      "",
      `It expires in ${CODE_MINUTES} minutes.`,
      "",
      purpose === "LOGIN"
        ? "If you weren't signing in, someone knows your password: change it straight away on your Profile page."
        : "If you didn't ask for this, you can ignore this email.",
      "",
      schoolName,
    ].join("\n"),
  });
};

// Replaces any earlier code for the same purpose and emails the new one
export const createEmailCode = async (userId: string, purpose: CodePurpose, email: string) => {
  await prisma.emailCode.deleteMany({ where: { userId, purpose } });
  const id = randomBytes(24).toString("base64url");
  const code = newCode();
  await prisma.emailCode.create({
    data: {
      id,
      userId,
      purpose,
      email,
      codeHash: hashCode(id, code),
      expiresAt: new Date(Date.now() + CODE_MINUTES * 60_000),
    },
  });
  try {
    await mailCode(email, code, purpose);
  } catch (err) {
    await prisma.emailCode.delete({ where: { id } }).catch(() => {});
    throw err;
  }
  return id;
};

// A fresh code for the same request, a limited number of times
export const resendEmailCode = async (row: EmailCode): Promise<string | null> => {
  if (row.sends >= MAX_CODE_SENDS) return "No more codes can be sent for this attempt. Start again.";
  const waited = (Date.now() - row.createdAt.getTime()) / 1000;
  if (waited < RESEND_SECONDS) {
    return `Wait ${Math.ceil(RESEND_SECONDS - waited)} seconds before asking for another code.`;
  }
  const code = newCode();
  await prisma.emailCode.update({
    where: { id: row.id },
    data: {
      codeHash: hashCode(row.id, code),
      attempts: 0,
      sends: { increment: 1 },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + CODE_MINUTES * 60_000),
    },
  });
  await mailCode(row.email, code, row.purpose as CodePurpose);
  return null;
};

// Checks a typed code, counting the attempt. Null when it's right.
export const checkEmailCode = async (row: EmailCode, typed: string): Promise<string | null> => {
  if (row.expiresAt < new Date()) return "That code has expired. Ask for a new one.";
  if (row.attempts >= MAX_CODE_ATTEMPTS) return "Too many wrong codes. Ask for a new one.";

  const code = typed.replace(/\D/g, "");
  await prisma.emailCode.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
  const expected = Buffer.from(row.codeHash, "hex");
  const given = Buffer.from(hashCode(row.id, code), "hex");
  if (code.length !== 6 || !timingSafeEqual(expected, given)) {
    const left = MAX_CODE_ATTEMPTS - row.attempts - 1;
    return left > 0
      ? `That code isn't right. ${left} attempt${left === 1 ? "" : "s"} left.`
      : "Too many wrong codes. Ask for a new one.";
  }
  return null;
};
