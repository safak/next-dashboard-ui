import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const {
      examId,
      studentId,
      obtainedMarks,
      remark,
    } = body;

    if (
      !examId ||
      !studentId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const evaluation =
      await prisma.examEvaluation.upsert(
        {
          where: {
            examId_studentId: {
              examId:
                Number(examId),
              studentId,
            },
          },

          update: {
            obtainedMarks:
              Number(
                obtainedMarks
              ),

            remark,
          },

          create: {
            examId:
              Number(examId),

            studentId,

            obtainedMarks:
              Number(
                obtainedMarks
              ),

            remark,
          },
        }
      );

    await prisma.result.upsert({
      where: {
        examId_studentId: {
          examId:
            Number(examId),
          studentId,
        },
      },

      update: {
        score:
          Number(
            obtainedMarks
          ),
      },

      create: {
        examId:
          Number(examId),

        studentId,

        score:
          Number(
            obtainedMarks
          ),
      },
    });

    return NextResponse.json(
      evaluation
    );
  } catch (error) {
    console.error(
      "Save Exam Evaluation Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save evaluation",
      },
      {
        status: 500,
      }
    );
  }
}