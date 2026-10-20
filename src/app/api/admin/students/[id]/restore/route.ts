import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        status: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (student.status !== StudentStatus.ARCHIVED) {
      return NextResponse.json(
        {
          success: false,
          message: "Only archived students can be restored.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id,
      },
      data: {
        status: StudentStatus.ACTIVE,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student restored successfully.",
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to restore student.",
      },
      {
        status: 500,
      },
    );
  }
}