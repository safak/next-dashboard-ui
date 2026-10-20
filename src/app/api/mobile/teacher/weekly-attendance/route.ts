import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const className = req.nextUrl.searchParams.get("className");

    if (!className) {
      return NextResponse.json([]);
    }

    const selectedClass = await prisma.class.findFirst({
      where: {
        name: className,
      },
    });

    if (!selectedClass) {
      return NextResponse.json([]);
    }

    const today = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );

    const day = today.getDay();

    const monday = new Date(today);

    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

    monday.setHours(0, 0, 0, 0);

    const saturday = new Date(monday);

    saturday.setDate(monday.getDate() + 5);

    const records = await prisma.attendance.findMany({
      where: {
        date: {
          gte: monday,
          lte: saturday,
        },
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}
