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

    return NextResponse.json(
      homework?.class.students || []
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const review =
      await prisma.homeworkRemark.upsert({
        where: {
          homeworkId_studentId: {
            homeworkId: body.homeworkId,
            studentId: body.studentId,
          },
        },

        update: {
          status: body.status,
          remark: body.remark,
        },

        create: {
          homeworkId: body.homeworkId,
          studentId: body.studentId,
          status: body.status,
          remark: body.remark,
        },
      });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}