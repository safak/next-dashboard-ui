import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        {
          error: "Month and Year are required.",
        },
        {
          status: 400,
        }
      );
    }

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);

    const attendance = await prisma.teacherAttendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            img: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          teacher: {
            name: "asc",
          },
        },
      ],
    });

    return NextResponse.json({
      month,
      year,
      totalRecords: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Teacher Attendance History Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch attendance history.",
      },
      {
        status: 500,
      }
    );
  }
}