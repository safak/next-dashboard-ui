import { Prisma } from "@prisma/client";

// Student numbers look like STU-2026-0007: the year registered plus a
// running count for that year. Numbers are shared between pending
// registrations and students, so both tables are checked.
export const nextStudentNumber = async (tx: Prisma.TransactionClient) => {
  const prefix = `STU-${new Date().getFullYear()}-`;
  const where = { studentNumber: { startsWith: prefix } };
  const orderBy = { studentNumber: "desc" as const };

  const [student, registration] = await Promise.all([
    tx.student.findFirst({ where, orderBy, select: { studentNumber: true } }),
    tx.studentRegistration.findFirst({
      where,
      orderBy,
      select: { studentNumber: true },
    }),
  ]);

  const last = Math.max(
    ...[student?.studentNumber, registration?.studentNumber].map((n) =>
      n ? parseInt(n.slice(prefix.length)) || 0 : 0
    )
  );

  return `${prefix}${String(last + 1).padStart(4, "0")}`;
};
