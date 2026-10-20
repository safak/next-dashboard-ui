import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
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
        { status: 404 }
      );
    }

    if (student.status !== StudentStatus.ARCHIVED) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only archived students can be permanently deleted.",
        },
        { status: 400 }
      );
    }

    await prisma.student.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student permanently deleted.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete student.",
      },
      { status: 500 }
    );
  }
}