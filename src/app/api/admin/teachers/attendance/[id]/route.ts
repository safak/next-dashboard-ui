import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AttendanceStatus } from "@prisma/client";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

/* =========================================================
   GET SINGLE ATTENDANCE
========================================================= */

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const attendance = await prisma.teacherAttendance.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            img: true,
          },
        },
      },
    });

    if (!attendance) {
      return NextResponse.json(
        {
          error: "Attendance not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Get Attendance Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch attendance.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE ATTENDANCE
========================================================= */

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const {
      status,
      remarks,
    }: {
      status: AttendanceStatus;
      remarks?: string;
    } = body;

    if (!status) {
      return NextResponse.json(
        {
          error: "Attendance status is required.",
        },
        {
          status: 400,
        }
      );
    }

    const existing = await prisma.teacherAttendance.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Attendance record not found.",
        },
        {
          status: 404,
        }
      );
    }

    const attendance = await prisma.teacherAttendance.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
        remarks,
        markedBy: userId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            img: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance updated successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Update Attendance Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update attendance.",
      },
      {
        status: 500,
      }
    );
  }
}