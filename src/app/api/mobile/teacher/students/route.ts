import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const className = searchParams.get("className");

    if (!className) {
      return NextResponse.json([]);
    }

    /* ================= CLASS ================= */

    const selectedClass = await prisma.class.findFirst({
      where: {
        name: className,
      },
    });

    if (!selectedClass) {
      return NextResponse.json([]);
    }

    /* ================= STUDENTS ================= */

    const students = await prisma.student.findMany({
      where: {
        classId: selectedClass.id,
      },

      orderBy: {
        createdAt: "asc",
      },

      select: {
        id: true,
        name: true,
        sex: true,
        img: true,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Students API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch students",
      },
      {
        status: 500,
      },
    );
  }
}
