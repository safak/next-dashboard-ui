"use server";

import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import {
  studentSubjectsSchema,
  StudentSubjectsSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clearAttempts } from "./rateLimit";
import { subjectChoicesProblem } from "./subjectChoices";

type State = { success: boolean; error: boolean; message?: string };

const NOT_ALLOWED: State = {
  success: false,
  error: true,
  message: "You are not allowed to do this.",
};

const isAdmin = async () => (await auth()).role === "admin";

// Replaces a learner's subjects and lesson types, e.g. for learners added
// before self-registration, or when they change subjects
export const updateStudentSubjects = async (
  _state: State,
  data: StudentSubjectsSchema
): Promise<State> => {
  if (!(await isAdmin())) return NOT_ALLOWED;

  const parsed = studentSubjectsSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: true,
      message: parsed.error.issues[0]?.message ?? "Check the subjects and try again.",
    };
  }
  const { studentId, subjects } = parsed.data;

  const problem = await subjectChoicesProblem(subjects);
  if (problem) return { success: false, error: true, message: problem };

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  });
  if (!student) return { success: false, error: true, message: "Student not found." };

  await prisma.$transaction([
    prisma.studentSubject.deleteMany({ where: { studentId } }),
    prisma.studentSubject.createMany({
      data: subjects.map((s) => ({ studentId, subjectId: s.subjectId, format: s.format })),
    }),
  ]);

  revalidatePath(`/list/students/${studentId}`);
  return { success: true, error: false };
};

// No 0/O or 1/l/I, so it can be read out over the phone
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const temporaryPassword = () =>
  Array.from({ length: 10 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

type ResetState = State & { username?: string; temporaryPassword?: string };

// For anyone who forgot their password, admins included. The new password
// is temporary: they must change it at their next sign-in, and every
// existing session of theirs is signed out.
export const resetPassword = async (
  _state: ResetState,
  formData: FormData
): Promise<ResetState> => {
  const { userId, role } = await auth();
  if (role !== "admin") return NOT_ALLOWED;

  const username = String(formData.get("username") ?? "").trim();
  if (!username) return { success: false, error: true, message: "Enter a username." };

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { success: false, error: true, message: `No account has the username "${username}".` };
  }
  if (user.id === userId) {
    return {
      success: false,
      error: true,
      message: "To change your own password, use your Profile page.",
    };
  }

  const password = temporaryPassword();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(password, 10),
      mustChangePassword: true,
      passwordChangedAt: new Date(),
    },
  });
  // A locked-out user usually calls the school; let them straight back in
  clearAttempts(`signin:user:${username.toLowerCase()}`);

  return { success: true, error: false, username: user.username, temporaryPassword: password };
};

// GRADES: a new school needs these before classes and registrations work

export const addGrade = async (_state: State, formData: FormData): Promise<State> => {
  if (!(await isAdmin())) return NOT_ALLOWED;
  const level = parseInt(String(formData.get("level")));
  if (!Number.isInteger(level) || level < 0 || level > 13) {
    return { success: false, error: true, message: "Enter a grade from 0 (Grade R) to 13." };
  }
  if (await prisma.grade.findUnique({ where: { level } })) {
    return { success: false, error: true, message: `Grade ${level} already exists.` };
  }
  await prisma.grade.create({ data: { level } });
  revalidatePath("/settings");
  return { success: true, error: false };
};

export const deleteGrade = async (_state: State, formData: FormData): Promise<State> => {
  if (!(await isAdmin())) return NOT_ALLOWED;
  const id = parseInt(String(formData.get("id")));
  const grade = await prisma.grade.findUnique({
    where: { id },
    include: {
      _count: { select: { classes: true, students: true, registrations: true, materials: true } },
    },
  });
  if (!grade) return { success: false, error: true, message: "That grade no longer exists." };
  const used = Object.values(grade._count).reduce((a, b) => a + b, 0);
  if (used > 0) {
    return {
      success: false,
      error: true,
      message: `Grade ${grade.level} still has classes, learners, registrations or materials.`,
    };
  }
  await prisma.grade.delete({ where: { id } });
  revalidatePath("/settings");
  return { success: true, error: false };
};
