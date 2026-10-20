import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

import ParentMobileDashboard from "./ParentMobileDashboard";

const ParentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) => {
  const params = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  const parentName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Parent";

  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
    include: {
      class: true,

      attendances: true,

      results: {
        include: {
          exam: {
            include: {
              subject: true,
              teacher: true,
              class: true,
            },
          },
        },
      },

      studentFees: {
        include: {
          plan: {
            include: {
              feeStructure: true,
            },
          },
          payments: {
            orderBy: {
              paidAt: "desc",
            },
          },
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  if (students.length === 0) {
    return null;
  }

  const activeId = params?.studentId || students[0].id;

  const student = students.find((item) => item.id === activeId) || students[0];

  const now = new Date();

  const upcomingExams = await prisma.exam.findMany({
    where: {
      classId: student.classId,
      examDate: {
        gte: now,
      },
    },
    include: {
      subject: true,
      teacher: true,
      class: true,
    },
    orderBy: {
      examDate: "asc",
    },
    take: 5,
  });

  const dayMap: Record<number, string | null> = {
    0: null,
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: null,
  };

  const todayEnumDay = dayMap[now.getDay()];

  let todayLessons: any[] = [];

  if (todayEnumDay) {
    todayLessons = await prisma.lesson.findMany({
      where: {
        classId: student.classId,
        day: todayEnumDay as any,
      },
      include: {
        subject: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  const monthlyAttendance = student.attendances.filter((attendance) => {
    const date = new Date(attendance.date);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const totalDays = monthlyAttendance.length;

  const presentDays = monthlyAttendance.filter(
    (attendance) => attendance.status,
  ).length;

  const absentDays = totalDays - presentDays;

  const attendanceRate =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const subjectMap: Record<
    string,
    {
      total: number;
      count: number;
    }
  > = {};

  student.results.forEach((result) => {
    if (!result.exam) {
      return;
    }

    const subjectName = result.exam.subject.name;

    if (!subjectMap[subjectName]) {
      subjectMap[subjectName] = {
        total: 0,
        count: 0,
      };
    }

    subjectMap[subjectName].total += result.score;
    subjectMap[subjectName].count += 1;
  });

  const performanceData = Object.values(subjectMap).map((item) =>
    Math.round(item.total / item.count),
  );

  const overallAverage =
    performanceData.length > 0
      ? Math.round(
          performanceData.reduce((sum, value) => sum + value, 0) /
            performanceData.length,
        )
      : 0;

  const totalFee = student.studentFees.reduce(
    (sum, fee) => sum + fee.totalAmount,
    0,
  );

  const totalPaid = student.studentFees.reduce(
    (sum, fee) =>
      sum +
      fee.payments.reduce(
        (paymentSum, payment) => paymentSum + payment.amount,
        0,
      ),
    0,
  );

  const pendingFee = Math.max(totalFee - totalPaid, 0);

  const studentData = students.map((item) => ({
    id: item.id,
    name: item.name,
    surname: item.surname,
    className: item.class.name,
    image: item.img,
  }));

  return (
    <ParentMobileDashboard
      parentName={parentName}
      students={studentData}
      activeStudentId={student.id}
      attendanceRate={attendanceRate}
    />
  );
};

export default ParentPage;
