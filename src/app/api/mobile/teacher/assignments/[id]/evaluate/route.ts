import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      studentId,
      obtainedMarks,
      remark,
    } = body;

    const evaluation =
      await prisma.assignmentEvaluation.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: Number(id),
            studentId,
          },
        },

        update: {
          obtainedMarks,
          remark,
        },

        create: {
          assignmentId: Number(id),
          studentId,
          obtainedMarks,
          remark,
        },
      });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to save evaluation",
      },
      {
        status: 500,
      }
    );
  }
}