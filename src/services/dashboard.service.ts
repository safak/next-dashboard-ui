// src/services/dashboard.service.ts

import prisma from "@/lib/prisma";

const today = new Date();
today.setHours(0, 0, 0, 0);

export async function getDashboardSummary() {
  const [
    students,
    teachers,
    parents,
    classes,
    totalLeads,
    todayLeads,
    paymentSummary,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.parent.count(),
    prisma.class.count(),

    prisma.lead.count(),

    prisma.lead.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    students,
    teachers,
    parents,
    classes,
    totalLeads,
    todayLeads,
    totalCollected: paymentSummary._sum.amount ?? 0,
  };
}

export async function getFinanceData() {
  const payments = await prisma.payment.findMany({
    select: {
      amount: true,
      paidAt: true,
    },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => ({
    month,
    fees: payments
      .filter((payment) => payment.paidAt.getMonth() === index)
      .reduce((sum, payment) => sum + payment.amount, 0),
  }));
}

export async function getAttendanceSummary() {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    return {
      studentPresent: 0,
      studentAbsent: 0,
      teacherPresent: 0,
      teacherAbsent: 0,
      attendanceRate: 0,
    };
  }

  const [studentAttendance, teacherAttendance] = await Promise.all([
    prisma.$queryRaw<Array<{ status: string }>>`
      SELECT a."status"
      FROM public."Attendance" a
      INNER JOIN public."Student" s
        ON s."id" = a."studentId"
      WHERE a."date" = CURRENT_DATE
        AND s."academicYearId" = ${academicYear.id}
    `,

    prisma.$queryRaw<Array<{ status: string }>>`
      SELECT "status"
      FROM public."TeacherAttendance"
      WHERE "date" = CURRENT_DATE
    `,
  ]);

  const studentPresent = studentAttendance.filter(
    (attendance) => attendance.status.toUpperCase() === "PRESENT",
  ).length;

  const studentAbsent = studentAttendance.filter(
    (attendance) => attendance.status.toUpperCase() === "ABSENT",
  ).length;

  const teacherPresent = teacherAttendance.filter(
    (attendance) => attendance.status.toUpperCase() === "PRESENT",
  ).length;

  const teacherAbsent = teacherAttendance.filter(
    (attendance) => attendance.status.toUpperCase() === "ABSENT",
  ).length;

  const markedStudents = studentPresent + studentAbsent;

  const attendanceRate =
    markedStudents === 0
      ? 0
      : Math.round((studentPresent / markedStudents) * 100);

  return {
    studentPresent,
    studentAbsent,
    teacherPresent,
    teacherAbsent,
    attendanceRate,
  };
}

export async function getPendingActions() {
  const [
    teacherLeaves,
    feePending,
    unreadNotifications,
    upcomingEvents,
    newLeads,
  ] = await Promise.all([
    prisma.teacherLeave.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.studentFee.count({
      where: {
        status: {
          in: ["PENDING", "PARTIAL"],
        },
      },
    }),

    prisma.notification.count({
      where: {
        isRead: false,
      },
    }),

    prisma.event.count({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
    }),

    prisma.lead.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    }),
  ]);

  return {
    teacherLeaves,
    feePending,
    unreadNotifications,
    upcomingEvents,
    newLeads,
  };
}

export async function getStudentOverview() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    return {
      totalStudents: 0,
      boys: 0,
      girls: 0,
      todayAdmissions: 0,
    };
  }

  const [totalStudents, boys, girls, todayAdmissions] = await Promise.all([
    prisma.student.count({
      where: {
        academicYearId: academicYear.id,
      },
    }),

    prisma.student.count({
      where: {
        academicYearId: academicYear.id,
        sex: "MALE",
      },
    }),

    prisma.student.count({
      where: {
        academicYearId: academicYear.id,
        sex: "FEMALE",
      },
    }),

    prisma.student.count({
      where: {
        academicYearId: academicYear.id,
        createdAt: {
          gte: today,
        },
      },
    }),
  ]);

  return {
    totalStudents,
    boys,
    girls,
    todayAdmissions,
  };
}

export async function getRecentActivities() {
  const [leaves, payments, leads, announcements] = await Promise.all([
    prisma.teacherLeave.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        teacher: true,
      },
    }),

    prisma.payment.findMany({
      take: 5,
      orderBy: {
        paidAt: "desc",
      },
      include: {
        studentFee: {
          include: {
            student: true,
          },
        },
      },
    }),

    prisma.lead.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.announcement.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const activities = [
    ...leaves.map((leave) => ({
      id: `leave-${leave.id}`,
      type: "LEAVE" as const,
      title: "Teacher Leave Request",
      description: `${leave.teacher.name} applied for ${leave.leaveType}`,
      createdAt: leave.createdAt,
    })),

    ...payments.map((payment) => ({
      id: `payment-${payment.id}`,
      type: "PAYMENT" as const,
      title: "Fee Collected",
      description: `₹${payment.amount} received from ${payment.studentFee.student.name}`,
      createdAt: payment.paidAt,
    })),

    ...leads.map((lead) => ({
      id: `lead-${lead.id}`,
      type: "LEAD" as const,
      title: "New Admission Lead",
      description: `${lead.name} enquired for admission`,
      createdAt: lead.createdAt,
    })),

    ...announcements.map((announcement) => ({
      id: `announcement-${announcement.id}`,
      type: "ANNOUNCEMENT" as const,
      title: "Announcement Published",
      description: announcement.title,
      createdAt: announcement.createdAt,
    })),
  ];

  return activities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);
}

export async function getFinanceSummary() {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    return {
      collected: 0,
      pending: 0,
      totalFee: 0,
      collectionRate: 0,
      chartData: [],
    };
  }

  const [studentFees, payments] = await Promise.all([
    prisma.studentFee.findMany({
      where: {
        student: {
          academicYearId: academicYear.id,
        },
      },
      select: {
        totalAmount: true,
        paidAmount: true,
      },
    }),

    prisma.payment.findMany({
      where: {
        studentFee: {
          student: {
            academicYearId: academicYear.id,
          },
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
      orderBy: {
        paidAt: "asc",
      },
    }),
  ]);

  const totalFee = studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0);

  const collected = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);

  const pending = totalFee - collected;

  const collectionRate =
    totalFee === 0 ? 0 : Math.round((collected / totalFee) * 100);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = months.map((month) => ({
    month,
    fees: 0,
  }));

  payments.forEach((payment) => {
    const month = payment.paidAt.getMonth();
    chartData[month].fees += payment.amount;
  });

  return {
    collected,
    pending,
    totalFee,
    collectionRate,
    chartData,
  };
}

export async function getDashboardData() {
  const [
    summary,
    studentOverview,
    financeSummary,
    attendance,
    pending,
    activities,
    enrollmentOverview,
    upcomingEvents,
  ] = await Promise.all([
    getDashboardSummary(),
    getStudentOverview(),
    getFinanceSummary(),
    getAttendanceSummary(),
    getPendingActions(),
    getRecentActivities(),
    getEnrollmentOverview(),
    getUpcomingEvents(),
  ]);

  return {
    summary,
    studentOverview,
    financeSummary,
    attendance,
    pending,
    activities,
    enrollmentOverview,
    upcomingEvents,
  };
}

export async function getEnrollmentOverview() {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    return [];
  }

  const [classes, students] = await Promise.all([
    prisma.class.findMany({
      where: {
        academicYearId: academicYear.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    }),

    prisma.student.findMany({
      where: {
        academicYearId: academicYear.id,
        status: "ACTIVE",
      },
      select: {
        classId: true,
        sex: true,
      },
    }),
  ]);

  return classes.map((classItem) => {
    const classStudents = students.filter(
      (student) => student.classId === classItem.id,
    );

    const boys = classStudents.filter(
      (student) => student.sex === "MALE",
    ).length;

    const girls = classStudents.filter(
      (student) => student.sex === "FEMALE",
    ).length;

    return {
      id: classItem.id,
      name: classItem.name,
      boys,
      girls,
      total: boys + girls,
    };
  });
}

export async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(),
      },
    },
    orderBy: {
      startTime: "asc",
    },
    take: 5,
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
  }));
}
