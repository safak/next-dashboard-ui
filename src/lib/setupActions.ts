"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "./auth";
import prisma from "./prisma";

const setupSchema = z
  .object({
    schoolName: z.string().trim().min(1, { message: "Enter the school's name." }).max(60),
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters." })
      .max(20)
      .regex(/^[a-zA-Z0-9._-]+$/, { message: "Use only letters, numbers, dots, dashes and underscores." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    fromGrade: z.coerce.number().int().min(0).max(13),
    toGrade: z.coerce.number().int().min(0).max(13),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match.", path: ["confirmPassword"] })
  .refine((d) => d.fromGrade <= d.toGrade, { message: "The first grade must come before the last.", path: ["toGrade"] });

class SetupDone extends Error {}

// Only works while the system has no accounts at all, i.e. on a brand-new
// installation; after that, admins are added from inside the app
export const completeSetup = async (
  _state: { error?: string },
  formData: FormData
): Promise<{ error?: string }> => {
  const parsed = setupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const d = parsed.data;
  const id = randomUUID();
  const password = await bcrypt.hash(d.password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      if ((await tx.user.count()) > 0) throw new SetupDone();
      await tx.user.create({ data: { id, username: d.username, password, role: "admin" } });
      await tx.admin.create({ data: { id, username: d.username } });
      await tx.setting.upsert({
        where: { id: 1 },
        update: { schoolName: d.schoolName },
        create: { id: 1, schoolName: d.schoolName },
      });
      for (let level = d.fromGrade; level <= d.toGrade; level++) {
        await tx.grade.upsert({ where: { level }, update: {}, create: { level } });
      }
    });
  } catch (err) {
    if (err instanceof SetupDone) return { error: "This system is already set up. Sign in instead." };
    console.log(err);
    return { error: "Setup couldn't be completed. Please try again." };
  }

  await createSession(id, "admin");
  redirect("/settings");
};
