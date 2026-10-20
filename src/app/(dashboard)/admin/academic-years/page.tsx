import prisma from "@/lib/prisma";

import AcademicYearDashboard from "./components/AcademicYearDashboard";

export default async function AcademicYearPage() {
  const academicYears = await prisma.academicYear.findMany({
    include: {
      _count: {
        select: {
          classes: true,
          students: true,
        },
      },
    },

    orderBy: {
      id: "desc",
    },
  });

  return <AcademicYearDashboard academicYears={academicYears} />;
}
