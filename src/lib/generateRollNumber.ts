import prisma from "@/lib/prisma";

/**
 * Generates the next roll number for a student.
 *
 * Series:
 * Nursery  -> 2026101
 * Jr KG    -> 2026201
 * Sr KG    -> 2026301
 * Grade 1  -> 2026401
 * Grade 2  -> 2026501
 */
export async function generateRollNumber(
  classId: number,
  academicYearId: number,
): Promise<string> {
  // Get class details
  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      name: true,
    },
  });

  if (!cls) {
    throw new Error("Class not found.");
  }

  /**
   * Starting series for each class
   * (2026100 -> first student becomes 2026101)
   */
  const SERIES: Record<string, number> = {
    Nursery: 2026100,
    "Jr KG": 2026200,
    "Sr KG": 2026300,
    "Grade 1": 2026400,
    "Grade 2": 2026500,
  };

  const base = SERIES[cls.name];

  if (!base) {
    throw new Error(`Roll number series not configured for "${cls.name}"`);
  }

  // Get last student in this class & academic year
  const lastStudent = await prisma.student.findFirst({
    where: {
      classId,
      academicYearId,
    },
    orderBy: {
      rollNo: "desc",
    },
    select: {
      rollNo: true,
    },
  });

  if (!lastStudent?.rollNo) {
    return String(base + 1);
  }

  return String(Number(lastStudent.rollNo) + 1);
}
