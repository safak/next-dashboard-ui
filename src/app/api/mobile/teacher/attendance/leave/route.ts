import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { teacherId, date, leaveType, reason } = body;

    /* ================= VALIDATION ================= */

    if (!teacherId || !date || !leaveType || !reason) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    /* ================= TEACHER ================= */

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        {
          error: "Teacher not found",
        },
        {
          status: 404,
        },
      );
    }

    /* ================= DATE ================= */

    const attendanceDate = new Date(date);

    attendanceDate.setHours(0, 0, 0, 0);

    /* ================= UPSERT ================= */

    await prisma.teacherAttendance.upsert({
      where: {
        teacherId_date: {
          teacherId,
          date: attendanceDate,
        },
      },
      update: {
        status: "LEAVE",
        remarks: `Leave Type: ${leaveType}. Reason: ${reason}`,
        markedBy: "teacher",
      },
      create: {
        teacherId,
        date: attendanceDate,
        status: "LEAVE",
        remarks: `Leave Type: ${leaveType}. Reason: ${reason}`,
        markedBy: "teacher",
      },
    });

    return NextResponse.json({
      success: true,

      message: "Leave applied successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to submit leave request",
      },
      {
        status: 500,
      },
    );
  }
}
