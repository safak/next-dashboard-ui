import "server-only";
import prisma from "./prisma";

// Each account's email address lives on its profile row (Admin, Teacher,
// Student or Parent), not on User

const table = (role: string) =>
  role === "admin"
    ? prisma.admin
    : role === "teacher"
    ? prisma.teacher
    : role === "student"
    ? prisma.student
    : role === "parent"
    ? prisma.parent
    : null;

export const getAccountEmail = async (userId: string, role: string): Promise<string | null> => {
  const t = table(role) as typeof prisma.admin | null;
  if (!t) return null;
  const row = await t.findUnique({ where: { id: userId }, select: { email: true } });
  return row?.email || null;
};

// Saves a (verified) email address on the profile row. False when another
// person of the same kind already uses it.
export const setAccountEmail = async (userId: string, role: string, email: string) => {
  const t = table(role) as typeof prisma.admin | null;
  if (!t) return false;
  const taken = await t.findFirst({ where: { email, id: { not: userId } }, select: { id: true } });
  if (taken) return false;
  await t.update({ where: { id: userId }, data: { email } });
  return true;
};

// Accounts matching what someone typed into "Forgot password": a username,
// or an email address on any profile
export const findAccounts = async (login: string) => {
  const byUsername = await prisma.user.findUnique({ where: { username: login } });
  if (byUsername) return [byUsername];
  if (!login.includes("@")) return [];

  // SQLite compares text case-sensitively; new addresses are saved in lower case
  const where = { where: { email: { in: [login, login.toLowerCase()] } }, select: { id: true } };
  const ids = (
    await Promise.all([
      prisma.admin.findMany(where),
      prisma.teacher.findMany(where),
      prisma.student.findMany(where),
      prisma.parent.findMany(where),
    ])
  )
    .flat()
    .map((p) => p.id);
  return ids.length ? prisma.user.findMany({ where: { id: { in: ids } } }) : [];
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
