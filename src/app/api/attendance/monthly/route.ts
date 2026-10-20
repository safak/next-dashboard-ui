import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
    );

    const endOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59)
    );

    // 🔥 Get teacher classes
    const classes = await prisma.class.findMany({
      where: { supervisorId: userId },
      select: { id: true },
    });

    const classIds = classes.map((c) => c.id);

    // 🔥 Fetch attendance
    const attendance = await prisma.attendance.findMany({
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
        student: { classId: { in: classIds } },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            classId: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(attendance);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}