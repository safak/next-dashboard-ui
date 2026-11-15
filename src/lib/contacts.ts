import { cache } from "react";
import prisma from "./prisma";

export type Contact = { id: string; name: string; role: string };

// Everyone who can actually sign in. Seeded database rows without a login
// account can't read messages, so the User table is the source of truth.
export const getAllUsers = cache(async (): Promise<Contact[]> => {
  const person = { select: { id: true, name: true, surname: true } };
  const [users, teachers, students, parents] = await Promise.all([
    prisma.user.findMany({ select: { id: true, username: true, role: true } }),
    prisma.teacher.findMany(person),
    prisma.student.findMany(person),
    prisma.parent.findMany(person),
  ]);

  const names = new Map(
    [...teachers, ...students, ...parents].map((p) => [
      p.id,
      `${p.name} ${p.surname}`,
    ])
  );

  return users
    .map((u) => ({
      id: u.id,
      name: names.get(u.id) ?? u.username,
      role: u.role,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

// Staff can message anyone; students and parents can message staff
export const canMessage = (fromRole?: string, toRole?: string) => {
  if (!fromRole || !toRole) return false;
  if (fromRole === "admin" || fromRole === "teacher") return true;
  return toRole === "admin" || toRole === "teacher";
};

export const getContacts = async (userId: string, role?: string) =>
  (await getAllUsers()).filter((u) => u.id !== userId && canMessage(role, u.role));
