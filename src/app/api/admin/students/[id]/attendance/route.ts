import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: id,
      },
      orderBy: {
        date: "desc",
      },
    });

    // -----------------------------
    // Student Validation
    // -----------------------------

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        {
          status: 404,
        },
      );
    }

    // -----------------------------
    // Empty Attendance
    // -----------------------------

    if (attendance.length === 0) {
      return NextResponse.json({
        success: true,

        summary: {
          attendancePercentage: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          workingDays: 0,
        },

        monthly: [],

        recentAttendance: [],
      });
    }

    // -----------------------------
    // Summary
    // -----------------------------

    const presentDays = attendance.filter(
      (item) => item.status === AttendanceStatus.PRESENT,
    ).length;

    const absentDays = attendance.filter(
      (item) => item.status === AttendanceStatus.ABSENT,
    ).length;

    const lateDays = attendance.filter(
      (item) => item.status === AttendanceStatus.LATE,
    ).length;

    const leaveDays = attendance.filter(
      (item) => item.status === AttendanceStatus.LEAVE,
    ).length;

    const workingDays = attendance.length;

    const attendancePercentage =
      workingDays === 0
        ? 0
        : Math.round(((presentDays + lateDays) / workingDays) * 100);

    // -----------------------------
    // Monthly Summary
    // -----------------------------

    const monthlyMap = new Map<
      string,
      {
        total: number;
        present: number;
      }
    >();

    attendance.forEach((record) => {
      const month = new Date(record.date).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          total: 0,
          present: 0,
        });
      }

      const data = monthlyMap.get(month)!;

      data.total++;

      if (
        record.status === AttendanceStatus.PRESENT ||
        record.status === AttendanceStatus.LATE
      ) {
        data.present++;
      }
    });

    const monthly = Array.from(monthlyMap.entries())
      .map(([month, value]) => ({
        month,
        percentage:
          value.total === 0
            ? 0
            : Math.round((value.present / value.total) * 100),
      }))
      .slice(0, 6);

    // -----------------------------
    // Recent Attendance
    // -----------------------------

    const recentAttendance = attendance.slice(0, 10).map((item) => ({
      id: item.id,
      date: item.date,
      status: item.status,
    }));

    // -----------------------------
    // Response
    // -----------------------------

    return NextResponse.json({
      success: true,

      summary: {
        attendancePercentage,
        presentDays,
        absentDays,
        lateDays,
        leaveDays,
        workingDays,
      },

      monthly,

      recentAttendance,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load attendance.",
      },
      {
        status: 500,
      },
    );
  }
}
