import { prisma } from "@/lib/prisma";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const className =
      searchParams.get("className");

    if (!className) {
      return NextResponse.json(
        {
          submitted: false,
          markedStudents: 0,
        }
      );
    }

    /* ================= CLASS ================= */

    const selectedClass =
      await prisma.class.findFirst({
        where: {
          name: className,
        },
      });

    if (!selectedClass) {
      return NextResponse.json(
        {
          submitted: false,
          markedStudents: 0,
        }
      );
    }

    /* ================= TODAY ================= */

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    /* ================= ATTENDANCE ================= */

    const attendanceRecords =
      await prisma.attendance.findMany({
        where: {
          date: today,

          student: {
            classId:
              selectedClass.id,
          },
        },

        orderBy: {
          updatedAt: "desc",
        },

        select: {
          id: true,
          updatedAt: true,
        },
      });

    const submitted =
      attendanceRecords.length > 0;

    const lastUpdated =
      attendanceRecords.length > 0
        ? attendanceRecords[0]
            .updatedAt
        : null;

    return NextResponse.json({
      submitted,

      markedStudents:
        attendanceRecords.length,

      lastUpdated,
    });
  } catch (error) {
    console.error(
      "Attendance Status Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch attendance status",
      },
      {
        status: 500,
      }
    );
  }
}