import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json([]);
    }

    const selectedClass =
      await prisma.class.findFirst({
        where: {
          name: className,
        },
      });

    if (!selectedClass) {
      return NextResponse.json([]);
    }

    /* ================= IST TODAY ================= */

    const now = new Date();

    const today = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    /* ================= FETCH ================= */

    const records =
      await prisma.attendance.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },

          student: {
            classId:
              selectedClass.id,
          },
        },

        select: {
          studentId: true,
          status: true,
          remarks: true,
          updatedAt: true,
        },

        orderBy: {
          updatedAt: "desc",
        },
      });

    console.log(
      "Attendance Date Range:",
      startOfDay,
      endOfDay
    );

    console.log(
      "Attendance Records:",
      records.length
    );

    return NextResponse.json(
      records
    );
  } catch (error) {
    console.error(
      "Attendance Fetch Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch attendance",
      },
      {
        status: 500,
      }
    );
  }
}