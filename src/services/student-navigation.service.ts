import { StudentStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

export interface StudentNavigationCounts {
  totalStudents: number;
  admissions: number;
  archived: number;
}

export async function getStudentNavigationCounts(): Promise<StudentNavigationCounts> {
  const [totalStudents, archived, admissions] = await Promise.all([
    prisma.student.count({
      where: {
        status: {
          not: StudentStatus.ARCHIVED,
        },
      },
    }),

    prisma.student.count({
      where: {
        status: StudentStatus.ARCHIVED,
      },
    }),

    prisma.student.count(),
  ]);

  return {
    totalStudents,
    archived,
    admissions,
  };
}