import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedStudent = await prisma.student.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        surname: body.surname,
        bloodType: body.bloodType,
        birthday: body.birthday ? new Date(body.birthday) : null,
        phone: body.phone,
        email: body.email,
        address: body.address,
        img: body.image,

        admissionNo: body.admissionNo,
        rollNo: body.rollNo,

        admissionDate: body.admissionDate
          ? new Date(body.admissionDate)
          : undefined,

        status: body.status,

        // If you're editing these as text for now, don't update them here.
        // We'll convert them to classId/academicYearId later.
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update student.",
      },
      {
        status: 500,
      },
    );
  }
}
