import prisma from "@/lib/prisma";

import AdmissionWizard from "./components/AdmissionWizard";

export default async function NewAdmissionPage() {
  const [classes, feeStructures, activeAcademicYear] =
    await Promise.all([
      prisma.class.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.feeStructure.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          {
            classId: "asc",
          },
          {
            title: "asc",
          },
        ],
        select: {
          id: true,
          title: true,
          annualFee: true,
          admissionFee: true,
          classId: true,
        },
      }),

      prisma.academicYear.findFirst({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          label: true,
        },
      }),
    ]);

  const feeStructureOptions = feeStructures.map((fee) => ({
    id: fee.id,
    title: fee.title,
    annualFee: Number(fee.annualFee),
    admissionFee: Number(fee.admissionFee),
    classId: fee.classId,
  }));

  return (
    <AdmissionWizard
      classes={classes}
      feeStructures={feeStructureOptions}
      academicYear={
        activeAcademicYear?.label ?? "2026-2027"
      }
      academicYearId={activeAcademicYear?.id ?? 0}
    />
  );
}