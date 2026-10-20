import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* ================= GET ================= */

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const className =
      searchParams.get("className");

    if (!className) {
      return NextResponse.json(
        {
          error: "Class name is required",
        },
        {
          status: 400,
        }
      );
    }

    const selectedClass =
      await prisma.class.findFirst({
        where: {
          name: className,
        },
      });

    if (!selectedClass) {
      return NextResponse.json([]);
    }

    const homework =
      await prisma.homework.findMany({
        where: {
          classId: selectedClass.id,
        },

        include: {
          subject: true,
          teacher: true,
          class: true,
        },

        orderBy: {
          dueDate: "asc",
        },
      });

    return NextResponse.json(homework);
  } catch (error) {
    console.error(error);

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

/* ================= POST ================= */

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const {
      title,
      description,
      classId,
      subjectId,
      dueDate,
    } = body;

    if (
      !title ||
      !description ||
      !classId ||
      !subjectId ||
      !dueDate
    ) {
      return NextResponse.json(
        {
          error:
            "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    /* TEMPORARY TEACHER */

    const teacher =
      await prisma.teacher.findFirst();

    if (!teacher) {
      return NextResponse.json(
        {
          error:
            "Teacher not found",
        },
        {
          status: 404,
        }
      );
    }

    const homework =
      await prisma.homework.create({
        data: {
          title,
          description,
          classId: Number(classId),
          subjectId:
            Number(subjectId),
          dueDate: new Date(
            dueDate
          ),
          teacherId: teacher.id,
        },
      });

    return NextResponse.json({
      success: true,
      homework,
    });
  } catch (error) {
    console.error(
      "Create Homework Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create homework",
      },
      {
        status: 500,
      }
    );
  }
}