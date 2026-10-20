import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const academicYearId = Number(searchParams.get("academicYearId"));
    const classId = Number(searchParams.get("classId"));

    if (!academicYearId || !classId) {
      return NextResponse.json(
        {
          success: false,
          message: "Academic year and class are required.",
        },
        {
          status: 400,
        },
      );
    }

    const students = await prisma.student.findMany({
      where: {
        academicYearId,
        classId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        rollNo: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load students.",
      },
      {
        status: 500,
      },
    );
  }
}