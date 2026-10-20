import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { getTodayUTCRange } from "@/lib/date";
import { generateTeacherInsights } from "@/lib/teacherInsights";

import TeacherMobileDashboard from "@/components/mobile/teacher/TeacherMobileDashboard";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [user, teacherProfile] = await Promise.all([
    currentUser(),
    prisma.teacher.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        img: true,
      },
    }),
  ]);

  const teacherName = teacherProfile?.name || user?.firstName || "Teacher";

  const myClasses = await prisma.class.findMany({
    where: {
      supervisorId: userId,
    },
    include: {
      students: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const classIds = myClasses.map((cls) => cls.id);

  const { start, end } = getTodayUTCRange();

  const attendanceWhere = {
    date: {
      gte: start,
      lte: end,
    },
    student: {
      classId: {
        in: classIds,
      },
    },
  };

  const [presentCount, totalMarked] = await Promise.all([
    prisma.attendance.count({
      where: {
        ...attendanceWhere,
        status: "present",
      },
    }),

    prisma.attendance.count({
      where: attendanceWhere,
    }),
  ]);

  const attendanceRate =
    totalMarked === 0 ? 0 : Math.round((presentCount / totalMarked) * 100);

  const studentStats = myClasses.flatMap((cls) =>
    cls.students.map((student) => ({
      name: student.name,
      present: 0,
      total: 0,
      percentage: 0,
    })),
  );

  const insights = generateTeacherInsights({
    attendanceRate,
    studentStats,
    pendingAssignments: 0,
  });

  return (
    <TeacherMobileDashboard
      teacherName={teacherName}
      teacherImage={teacherProfile?.img ?? null}
      attendanceRate={attendanceRate}
      myClasses={myClasses}
      tests={[]}
      insights={insights}
    />
  );
}
