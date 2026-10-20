import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const homeworkId = Number(id);

    const homework = await prisma.homework.findUnique({
      where: {
        id: homeworkId,
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
                homeworkRemarks: {
                  where: {
                    homeworkId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!homework) {
      return NextResponse.json(
        {
          error: "Homework not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(homework);
  } catch (error) {
    console.error("Fetch Homework Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch homework",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const homework = await prisma.homework.update({
      where: {
        id: Number(id),
      },

      data: {
        title: body.title,
        description: body.description,
        dueDate: body.dueDate
          ? new Date(body.dueDate)
          : undefined,

        subjectId: body.subjectId,
      },
    });

    return NextResponse.json(homework);
  } catch (error) {
    console.error("Update Homework Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update homework",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const homeworkId = Number(id);

    await prisma.homeworkRemark.deleteMany({
      where: {
        homeworkId,
      },
    });

    await prisma.homework.delete({
      where: {
        id: homeworkId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete Homework Error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete homework",
      },
      {
        status: 500,
      }
    );
  }
}