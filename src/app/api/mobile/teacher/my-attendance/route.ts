import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

function formatLeaveType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const { userId } = await auth();
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    /* ================= VALIDATION ================= */

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = userId;

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and Year are required" },
        { status: 400 },
      );
    }

    /* ================= TEACHER ================= */

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    /* ================= DATE RANGE ================= */

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 1);

    /* ================= ATTENDANCE ================= */

    const attendance = await prisma.teacherAttendance.findMany({
      where: {
        teacherId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },

      orderBy: {
        date: "desc",
      },
    });

    /* ================= LEAVE REQUESTS ================= */

    const leaveRequests = await prisma.teacherLeave.findMany({
      where: {
        teacherId,

        status: {
          not: "CANCELLED",
        },

        leaveDate: {
          gte: startDate,
          lt: endDate,
        },
      },

      orderBy: {
        leaveDate: "desc",
      },
    });

    const attendanceActivities = attendance.map((item) => ({
      id: item.id,

      type: "ATTENDANCE",

      title: item.status.charAt(0) + item.status.slice(1).toLowerCase(),

      subtitle:
        item.status === "PRESENT"
          ? "Attendance Marked"
          : item.status === "LATE"
            ? "Marked Late"
            : item.status === "ABSENT"
              ? "Absent"
              : "Leave",

      status: item.status,

      canManage: false,

      date: item.date,

      createdAt: item.createdAt,

      remarks: item.remarks,
    }));

    const leaveActivities = leaveRequests.map((item) => ({
      id: item.id,

      type: "LEAVE",

      title: `${formatLeaveType(item.leaveType)} Leave`,

      subtitle:
        item.status === "PENDING"
          ? "Pending Approval"
          : item.status === "APPROVED"
            ? "Approved"
            : "Rejected",

      status: item.status,

      canManage: item.status === "PENDING",

      date: item.leaveDate,

      createdAt: item.createdAt,

      leaveType: item.leaveType,

      duration: item.duration,

      reason: item.reason,
    }));

    const activities = [...attendanceActivities, ...leaveActivities].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    /* ================= SUMMARY ================= */

    const present = attendance.filter((x) => x.status === "PRESENT").length;

    const absent = attendance.filter((x) => x.status === "ABSENT").length;

    const late = attendance.filter((x) => x.status === "LATE").length;

    const leave = attendance.filter((x) => x.status === "LEAVE").length;

    const workingDays = present + absent + late + leave;

    const percentage =
      workingDays === 0
        ? 0
        : Math.round(((present + late) / workingDays) * 100);

    /* ================= LEAVE SUMMARY ================= */

    const pendingLeaves = leaveRequests.filter(
      (x) => x.status === "PENDING",
    ).length;

    const approvedLeaves = leaveRequests.filter(
      (x) => x.status === "APPROVED",
    ).length;

    const rejectedLeaves = leaveRequests.filter(
      (x) => x.status === "REJECTED",
    ).length;

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      summary: {
        percentage,

        present,

        absent,

        late,

        leaves: leave,

        workingDays,

        pendingLeaves,

        approvedLeaves,

        rejectedLeaves,
      },

      activities,
    });
  } catch (error) {
    console.error("Teacher Attendance Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch teacher attendance",
      },
      {
        status: 500,
      },
    );
  }
}
