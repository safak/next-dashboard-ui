import prisma from "@/lib/prisma";

import StudentAttendanceDashboard from "./components/StudentAttendanceDashboard";

export default async function StudentAttendancePage() {
  const classes = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      academicYear: {
        select: {
          id: true,
          label: true,
        },
      },
    },
    orderBy: [
      {
        academicYearId: "desc",
      },
      {
        order: "asc",
      },
    ],
  });

  return (
    <StudentAttendanceDashboard
      classes={classes}
    />
  );
}