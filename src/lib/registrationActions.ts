"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth, createSession } from "./auth";
import { CONTRACT_VERSION } from "./contract";
import {
  approveRegistrationSchema,
  ApproveRegistrationSchema,
  linkChildSchema,
  LinkChildSchema,
  parentRegistrationSchema,
  ParentRegistrationSchema,
  studentRegistrationSchema,
  StudentRegistrationSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { nextStudentNumber } from "./studentNumber";

type RegistrationState = {
  success: boolean;
  error: boolean;
  message?: string;
  studentNumber?: string;
};

const fail = (message: string): RegistrationState => ({
  success: false,
  error: true,
  message,
});

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
    ? "That username, email or phone number is already in use."
    : fallback;

// Taken by an account, or held by a registration still waiting for approval
const isUsernameTaken = async (username: string) => {
  const [user, pending] = await Promise.all([
    prisma.user.findUnique({ where: { username }, select: { id: true } }),
    prisma.studentRegistration.findFirst({
      where: { username, status: "PENDING" },
      select: { id: true },
    }),
  ]);
  return !!user || !!pending;
};

const sameDay = (a: Date, b: Date) =>
  a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);

const NO_MATCH =
  "No student matches that student number and date of birth. Check both and try again.";
const ALREADY_LINKED =
  "That student is already linked to a parent account. Contact the school if this is wrong.";

// Finds the child a parent is claiming. They must know both the student
// number and the date of birth, so a guessed number alone isn't enough.
const findChild = async (
  tx: Prisma.TransactionClient,
  studentNumber: string,
  birthday: Date
) => {
  const student = await tx.student.findUnique({
    where: { studentNumber },
    select: { id: true, birthday: true, parentId: true },
  });
  if (student) {
    if (!sameDay(student.birthday, birthday)) return { error: NO_MATCH };
    if (student.parentId) return { error: ALREADY_LINKED };
    return { studentId: student.id };
  }

  const registration = await tx.studentRegistration.findUnique({
    where: { studentNumber },
    select: { id: true, birthday: true, parentId: true, status: true },
  });
  if (
    !registration ||
    registration.status !== "PENDING" ||
    !sameDay(registration.birthday, birthday)
  ) {
    return { error: NO_MATCH };
  }
  if (registration.parentId) return { error: ALREADY_LINKED };
  return { registrationId: registration.id };
};

const linkChildToParent = (
  tx: Prisma.TransactionClient,
  child: { studentId?: string; registrationId?: string },
  parentId: string
) =>
  child.studentId
    ? tx.student.update({ where: { id: child.studentId }, data: { parentId } })
    : tx.studentRegistration.update({
        where: { id: child.registrationId },
        data: { parentId },
      });

// Thrown inside a transaction to roll it back with a message for the user
class RegistrationError extends Error {}

export const registerStudent = async (
  _state: RegistrationState,
  data: StudentRegistrationSchema
): Promise<RegistrationState> => {
  const parsed = studentRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form and try again.");
  }
  const d = parsed.data;

  try {
    if (await isUsernameTaken(d.username)) {
      return fail("That username is already taken. Choose another one.");
    }

    const grade = await prisma.grade.findUnique({ where: { id: d.gradeId } });
    if (!grade) return fail("Choose the grade you are enrolling into.");

    const password = await bcrypt.hash(d.password, 10);

    // Two people registering at the same moment can draw the same number;
    // the unique index rejects one of them, which then tries again
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const registration = await prisma.$transaction(async (tx) =>
          tx.studentRegistration.create({
            data: {
              studentNumber: await nextStudentNumber(tx),
              username: d.username,
              password,
              name: d.name,
              surname: d.surname,
              email: d.email || null,
              phone: d.phone || null,
              address: d.address,
              bloodType: d.bloodType,
              sex: d.sex,
              birthday: d.birthday,
              gradeId: d.gradeId,
              previousSchool: d.previousSchool || null,
              lastGradeCompleted: d.lastGradeCompleted || null,
              medicalNotes: d.medicalNotes || null,
              guardianName: d.guardianName,
              guardianRelationship: d.guardianRelationship,
              guardianPhone: d.guardianPhone,
              guardianEmail: d.guardianEmail || null,
              contractVersion: CONTRACT_VERSION,
              contractSignature: d.contractSignature,
              contractSignedAt: new Date(),
              subjects: {
                connect: d.subjects.map((id) => ({ id: parseInt(id) })),
              },
            },
          })
        );
        revalidatePath("/list/registrations");
        return {
          success: true,
          error: false,
          studentNumber: registration.studentNumber,
        };
      } catch (err) {
        const numberClash =
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002" &&
          String(err.meta?.target).includes("studentNumber");
        if (!numberClash) throw err;
      }
    }
    return fail("The registration could not be saved. Please try again.");
  } catch (err) {
    console.log(err);
    return fail(errorMessage(err, "The registration could not be saved."));
  }
};

export const registerParent = async (
  _state: RegistrationState,
  data: ParentRegistrationSchema
): Promise<RegistrationState> => {
  const parsed = parentRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form and try again.");
  }
  const d = parsed.data;
  const id = randomUUID();

  try {
    if (await isUsernameTaken(d.username)) {
      return fail("That username is already taken. Choose another one.");
    }
    const password = await bcrypt.hash(d.password, 10);

    await prisma.$transaction(async (tx) => {
      const child = await findChild(tx, d.studentNumber, d.childBirthday);
      if ("error" in child) throw new RegistrationError(child.error);

      await tx.user.create({
        data: { id, username: d.username, password, role: "parent" },
      });
      await tx.parent.create({
        data: {
          id,
          username: d.username,
          name: d.name,
          surname: d.surname,
          email: d.email || null,
          phone: d.phone,
          address: d.address,
        },
      });
      await linkChildToParent(tx, child, id);
    });
  } catch (err) {
    if (err instanceof RegistrationError) return fail(err.message);
    console.log(err);
    return fail(errorMessage(err, "The registration could not be saved."));
  }

  // The child check stands in for approval, so sign them straight in
  await createSession(id, "parent");
  redirect("/parent");
};

// For parents with more than one child at the school
export const linkChild = async (
  _state: RegistrationState,
  data: LinkChildSchema
): Promise<RegistrationState> => {
  const { userId, role } = await auth();
  if (!userId || role !== "parent") return fail("Only parents can link a child.");

  const parsed = linkChildSchema.safeParse(data);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form and try again.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const child = await findChild(
        tx,
        parsed.data.studentNumber,
        parsed.data.childBirthday
      );
      if ("error" in child) throw new RegistrationError(child.error);
      await linkChildToParent(tx, child, userId);
    });
  } catch (err) {
    if (err instanceof RegistrationError) return fail(err.message);
    console.log(err);
    return fail("The child could not be linked. Please try again.");
  }

  revalidatePath("/parent");
  return { success: true, error: false };
};

const isAdmin = async () => (await auth()).role === "admin";

export const approveRegistration = async (
  _state: RegistrationState,
  data: ApproveRegistrationSchema
): Promise<RegistrationState> => {
  if (!(await isAdmin())) return fail("You are not allowed to do this.");

  const parsed = approveRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Choose a class.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const reg = await tx.studentRegistration.findUnique({
        where: { id: parsed.data.id },
        include: { subjects: { select: { id: true } } },
      });
      if (!reg || reg.status !== "PENDING") {
        throw new RegistrationError("This registration has already been handled.");
      }

      const classItem = await tx.class.findUnique({
        where: { id: parsed.data.classId },
        include: { _count: { select: { students: true } } },
      });
      if (!classItem || classItem.gradeId !== reg.gradeId) {
        throw new RegistrationError("Choose a class in the grade the student applied for.");
      }
      if (classItem._count.students >= classItem.capacity) {
        throw new RegistrationError(`Class ${classItem.name} is full.`);
      }

      const id = randomUUID();
      await tx.user.create({
        data: { id, username: reg.username, password: reg.password, role: "student" },
      });
      await tx.student.create({
        data: {
          id,
          studentNumber: reg.studentNumber,
          username: reg.username,
          name: reg.name,
          surname: reg.surname,
          email: reg.email,
          phone: reg.phone,
          address: reg.address,
          bloodType: reg.bloodType,
          sex: reg.sex,
          birthday: reg.birthday,
          gradeId: reg.gradeId,
          classId: classItem.id,
          parentId: reg.parentId,
          subjects: { connect: reg.subjects },
        },
      });
      await tx.studentRegistration.update({
        where: { id: reg.id },
        data: { status: "APPROVED", studentId: id, reviewedAt: new Date() },
      });
    });
  } catch (err) {
    if (err instanceof RegistrationError) return fail(err.message);
    console.log(err);
    return fail(errorMessage(err, "The registration could not be approved."));
  }

  revalidatePath("/list/registrations");
  revalidatePath("/list/students");
  return { success: true, error: false };
};

export const rejectRegistration = async (
  _state: RegistrationState,
  formData: FormData
): Promise<RegistrationState> => {
  if (!(await isAdmin())) return fail("You are not allowed to do this.");

  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  const { count } = await prisma.studentRegistration.updateMany({
    where: { id, status: "PENDING" },
    data: {
      status: "REJECTED",
      rejectionReason: reason || null,
      reviewedAt: new Date(),
    },
  });
  if (count === 0) return fail("This registration has already been handled.");

  revalidatePath("/list/registrations");
  return { success: true, error: false };
};
