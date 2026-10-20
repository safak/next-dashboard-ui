import { Prisma } from "@prisma/client";

export function scopeLessons(
  role: string | undefined,
  userId: string | null
): Prisma.LessonWhereInput {

  if (role === "teacher" && userId) {
    return { teacherId: userId };
  }

  return {};
}