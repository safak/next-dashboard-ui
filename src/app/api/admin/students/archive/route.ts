import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { studentIds } = body as {
      studentIds: string[];
    };

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select at least one student.",
        },
        { status: 400 }
      );
    }

    const existingStudents = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingStudents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No students found.",
        },
        { status: 404 }
      );
    }

    const activeStudentIds = existingStudents
      .filter((student) => student.status !== StudentStatus.ARCHIVED)
      .map((student) => student.id);

    if (activeStudentIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected students are already archived.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.student.updateMany({
      where: {
        id: {
          in: activeStudentIds,
        },
      },
      data: {
        status: StudentStatus.ARCHIVED,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} student${result.count > 1 ? "s" : ""} archived successfully.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Bulk Archive Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to archive students.",
      },
      { status: 500 }
    );
  }
}