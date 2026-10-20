import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

function generatePromotedRollNo(
  currentRollNo: string,
  destinationRollPrefix: string,
): string {
  if (!currentRollNo) {
    throw new Error("Student roll number is missing.");
  }

  if (!/^\d+$/.test(currentRollNo)) {
    throw new Error(`Invalid student roll number: ${currentRollNo}`);
  }

  /*
   * Example:
   *
   * Current:
   * 2026301
   *
   * Structure:
   * 2026 | 3 | 01
   *
   * Destination prefix:
   * 4
   *
   * Result:
   * 2026 | 4 | 01
   *
   * 2026401
   */

  const yearPart = currentRollNo.slice(0, 4);

  const sequencePart = currentRollNo.slice(5);

  return `${yearPart}${destinationRollPrefix}${sequencePart}`;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const {
      studentIds,
      currentAcademicYearId,
      nextAcademicYearId,
      currentClassId,
      destinationClassId,
    } = body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No students selected.",
        },
        { status: 400 },
      );
    }

    if (currentAcademicYearId === nextAcademicYearId) {
      return NextResponse.json(
        {
          success: false,
          message: "Current and next academic year cannot be the same.",
        },
        { status: 400 },
      );
    }

    if (currentClassId === destinationClassId) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination class cannot be the same.",
        },
        { status: 400 },
      );
    }

    const destinationClass = await prisma.class.findUnique({
      where: {
        id: destinationClassId,
      },
      select: {
        id: true,
        name: true,
        rollPrefix: true,
      },
    });

    if (!destinationClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination class not found.",
        },
        { status: 404 },
      );
    }

    if (!destinationClass.rollPrefix) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination class does not have a roll prefix configured.",
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let promotedCount = 0;

      for (const studentId of studentIds) {
        const student = await tx.student.findUnique({
          where: {
            id: studentId,
          },
        });

        if (!student) {
          continue;
        }

        if (!student.rollNo) {
          throw new Error(`Roll number is missing for student ${student.id}.`);
        }

        const oldRollNo = student.rollNo;

        const newRollNo = generatePromotedRollNo(
          oldRollNo,
          String(destinationClass.rollPrefix),
        );

        /*
         * Prevent duplicate roll numbers.
         */
        const existingStudent = await tx.student.findUnique({
          where: {
            rollNo: newRollNo,
          },
        });

        if (existingStudent && existingStudent.id !== student.id) {
          throw new Error(
            `Roll number ${newRollNo} is already assigned to another student.`,
          );
        }

        /*
         * Update student.
         */
        await tx.student.update({
          where: {
            id: student.id,
          },
          data: {
            academicYearId: nextAcademicYearId,
            classId: destinationClassId,
            rollNo: newRollNo,
          },
        });

        /*
         * Create promotion history.
         */
        await tx.studentPromotion.create({
          data: {
            studentId: student.id,

            fromAcademicYearId: currentAcademicYearId,

            toAcademicYearId: nextAcademicYearId,

            fromClassId: currentClassId,

            toClassId: destinationClassId,

            fromRollNo: oldRollNo,

            toRollNo: newRollNo,

            promotedBy: userId,

            remarks: null,
          },
        });

        promotedCount++;
      }

      return {
        promotedCount,
      };
    });

    return NextResponse.json({
      success: true,
      count: result.promotedCount,
    });
  } catch (error) {
    console.error("Student promotion failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to promote students.",
      },
      {
        status: 500,
      },
    );
  }
}
