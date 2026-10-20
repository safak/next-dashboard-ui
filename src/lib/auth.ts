import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function getAuthUser() {
  const { sessionClaims, userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!role) {
    throw new Error("Role not assigned");
  }

  return {
    userId,
    role,
    isAdmin: role === "admin",
    isTeacher: role === "teacher",
    isParent: role === "parent",
    isStudent: role === "student",
  };
}

// ================= ADMIN =================
export async function requireAdmin() {
  const user = await getAuthUser();

  if (!user.isAdmin) {
    throw new Error("Forbidden: Admin only");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: user.userId },
  });

  if (!admin) {
    throw new Error("Admin not found in DB");
  }

  return admin;
}

// ================= TEACHER =================
export async function requireTeacher() {
  const user = await getAuthUser();

  if (!user.isTeacher) {
    throw new Error("Forbidden: Teacher only");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: user.userId },
  });

  if (!teacher) {
    throw new Error("Teacher not found in DB");
  }

  return teacher;
}

// ================= PARENT =================
export async function requireParent() {
  const user = await getAuthUser();

  if (!user.isParent) {
    throw new Error("Forbidden: Parent only");
  }

  const parent = await prisma.parent.findUnique({
    where: { id: user.userId },
  });

  if (!parent) {
    throw new Error("Parent not found in DB");
  }

  return parent;
}

// ================= STUDENT =================
export async function requireStudent() {
  const user = await getAuthUser();

  if (!user.isStudent) {
    throw new Error("Forbidden: Student only");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.userId },
  });

  if (!student) {
    throw new Error("Student not found in DB");
  }

  return student;
}