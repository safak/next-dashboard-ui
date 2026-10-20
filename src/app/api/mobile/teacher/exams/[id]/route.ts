import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const exam = await prisma.exam.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        class: {
          include: {
            students: {
              include: {
                evaluations: {
                  where: {
                    examId: Number(id),
                  },
                },
              },
            },
          },
        },

        subject: true,

        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },

        evaluations: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          error: "Exam not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error(
      "Fetch Exam Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch exam",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const body =
      await request.json();

    const exam =
      await prisma.exam.update({
        where: {
          id: Number(id),
        },

        data: {
          title: body.title,

          description:
            body.description,

          totalMarks:
            Number(
              body.totalMarks
            ),

          examDate:
            body.examDate
              ? new Date(
                  body.examDate
                )
              : undefined,

          classId:
            body.classId
              ? Number(
                  body.classId
                )
              : undefined,

          subjectId:
            body.subjectId
              ? Number(
                  body.subjectId
                )
              : undefined,
        },

        include: {
          class: true,
          subject: true,
          teacher: true,
        },
      });

    return NextResponse.json(
      exam
    );
  } catch (error) {
    console.error(
      "Update Exam Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update exam",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    await prisma.examEvaluation.deleteMany(
      {
        where: {
          examId: Number(id),
        },
      }
    );

    await prisma.result.deleteMany({
      where: {
        examId: Number(id),
      },
    });

    await prisma.exam.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete Exam Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete exam",
      },
      {
        status: 500,
      }
    );
  }
}