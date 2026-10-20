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

    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id: Number(id),
        },

        include: {
          subject: true,

          teacher: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },

          class: {
            include: {
              students: {
                include: {
                  assignmentEvaluations: {
                    where: {
                      assignmentId: Number(id),
                    },
                  },
                },
              },
            },
          },

          evaluations: {
            include: {
              student: true,
            },
          },
        },
      });

    if (!assignment) {
      return NextResponse.json(
        {
          error: "Assignment not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error(
      "Fetch Assignment Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch assignment",
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

    const assignment =
      await prisma.assignment.update({
        where: {
          id: Number(id),
        },

        data: {
          title: body.title,
          description:
            body.description,

          totalMarks:
            Number(body.totalMarks),

          startDate:
            body.startDate
              ? new Date(
                  body.startDate
                )
              : undefined,

          dueDate:
            body.dueDate
              ? new Date(
                  body.dueDate
                )
              : undefined,
        },

        include: {
          class: true,
          subject: true,

          teacher: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

    return NextResponse.json(
      assignment
    );
  } catch (error) {
    console.error(
      "Update Assignment Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update assignment",
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

    await prisma.assignmentEvaluation.deleteMany(
      {
        where: {
          assignmentId: Number(id),
        },
      }
    );

    await prisma.assignment.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete Assignment Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete assignment",
      },
      {
        status: 500,
      }
    );
  }
}