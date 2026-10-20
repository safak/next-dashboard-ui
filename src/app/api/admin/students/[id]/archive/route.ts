import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log("StudentStatus Enum:", StudentStatus);
    console.log("ARCHIVED Value:", StudentStatus.ARCHIVED);

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

    console.log("Student Before Update:", student);
    console.log("Updating Student ID:", id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        { status: 404 },
      );
    }

    if (student.status === StudentStatus.ARCHIVED) {
      return NextResponse.json(
        {
          success: false,
          message: "Student is already archived.",
        },
        { status: 400 },
      );
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id,
      },
      data: {
        status: StudentStatus.ARCHIVED,
      },
    });

    console.log("Updated Student:", updatedStudent);

    return NextResponse.json({
      success: true,
      message: "Student archived successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to archive student.",
      },
      { status: 500 },
    );
  }
}
