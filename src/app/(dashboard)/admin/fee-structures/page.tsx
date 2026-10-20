import prisma from "@/lib/prisma";

import FeeStructuresDashboard from "./components/FeeStructuresDashboard";

export default async function FeeStructuresPage() {
  const [feeStructures, classes] = await Promise.all([
    prisma.feeStructure.findMany({
      orderBy: {
        classId: "asc",
      },
      select: {
        id: true,
        classId: true,
        title: true,
        annualFee: true,
        admissionFee: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    prisma.class.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const serializedFeeStructures = feeStructures.map((fee) => ({
    id: fee.id,
    classId: fee.classId,
    title: fee.title,
    annualFee: Number(fee.annualFee),
    admissionFee: Number(fee.admissionFee),
    isActive: fee.isActive,
    createdAt: fee.createdAt.toISOString(),
    updatedAt: fee.updatedAt.toISOString(),
    class: {
      id: fee.class.id,
      name: fee.class.name,
    },
  }));

  const classOptions = classes.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const summary = {
    totalStructures: feeStructures.length,
    activeStructures: feeStructures.filter((fee) => fee.isActive).length,
    inactiveStructures: feeStructures.filter((fee) => !fee.isActive).length,
    classesConfigured: new Set(
      feeStructures.filter((fee) => fee.isActive).map((fee) => fee.classId),
    ).size,
  };

  return (
    <FeeStructuresDashboard
      feeStructures={serializedFeeStructures}
      classOptions={classOptions}
      summary={summary}
    />
  );
}
