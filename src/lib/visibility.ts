import { Prisma } from "@prisma/client";

// Class-scoped records (announcements, events) a user may see: school-wide
// ones plus those for classes the user teaches, attends or has a child in
export const classScopedWhere = (
  role: string | undefined,
  userId: string
): Prisma.AnnouncementWhereInput & Prisma.EventWhereInput => {
  if (role === "admin") return {};

  const classCondition: Prisma.ClassWhereInput | undefined =
    role === "teacher"
      ? { lessons: { some: { teacherId: userId } } }
      : role === "student"
      ? { students: { some: { id: userId } } }
      : role === "parent"
      ? { students: { some: { parentId: userId } } }
      : undefined;

  return {
    OR: [{ classId: null }, ...(classCondition ? [{ class: classCondition }] : [])],
  };
};
