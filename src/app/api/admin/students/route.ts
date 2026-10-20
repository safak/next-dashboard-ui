import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";

export async function DELETE(request: NextRequest) {
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
        { status: 400 },
      );
    }

    // Check if students exist
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
        { status: 404 },
      );
    }

    // Safety: only archived students can be permanently deleted
    const deletableIds = existingStudents
      .filter((student) => student.status === StudentStatus.ARCHIVED)
      .map((student) => student.id);

    if (deletableIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Only archived students can be permanently deleted.",
        },
        { status: 400 },
      );
    }

    const result = await prisma.student.deleteMany({
      where: {
        id: {
          in: deletableIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} student${result.count > 1 ? "s" : ""} deleted permanently.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete students.",
      },
      { status: 500 },
    );
  }
}