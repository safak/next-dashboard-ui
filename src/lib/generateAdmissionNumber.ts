import prisma from "@/lib/prisma";

export async function generateAdmissionNumber(): Promise<string> {
  const year = new Date().getFullYear();

  const prefix = `ADM${year}`;

  const latestStudent = await prisma.student.findFirst({
    where: {
      admissionNo: {
        startsWith: prefix,
      },
    },
    orderBy: {
      admissionNo: "desc",
    },
    select: {
      admissionNo: true,
    },
  });

  let nextNumber = 1;

  if (latestStudent?.admissionNo) {
    const lastSequence = parseInt(
      latestStudent.admissionNo.replace(prefix, ""),
      10,
    );

    if (!Number.isNaN(lastSequence)) {
      nextNumber = lastSequence + 1;
    }
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}