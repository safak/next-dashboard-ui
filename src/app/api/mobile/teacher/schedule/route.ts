import { prisma } from "@/lib/prisma";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Day } from "@prisma/client";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const className =
      searchParams.get("className");

    const day =
      searchParams.get("day");

    if (!className) {
      return NextResponse.json([]);
    }

    /* ================= CLASS ================= */

    const selectedClass =
      await prisma.class.findFirst({
        where: {
          name: className,
        },
      });

    if (!selectedClass) {
      return NextResponse.json([]);
    }

    /* ================= DAY ENUM ================= */

    let formattedDay:
      | Day
      | undefined = undefined;

    if (day) {
      formattedDay =
        day.toUpperCase() as Day;
    }

    /* ================= LESSONS ================= */

    const lessons =
      await prisma.lesson.findMany({
        where: {
          classId: selectedClass.id,

          ...(formattedDay && {
            day: formattedDay,
          }),
        },

        orderBy: {
          startTime: "asc",
        },

        select: {
          id: true,
          name: true,
          day: true,
          startTime: true,
          endTime: true,
        },
      });

    return NextResponse.json(
      lessons
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch schedule",
      },
      {
        status: 500,
      }
    );
  }
}