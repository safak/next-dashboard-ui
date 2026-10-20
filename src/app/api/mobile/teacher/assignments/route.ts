import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },

        subject: {
          select: {
            id: true,
            name: true,
          },
        },

        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },

        evaluations: true,
      },

      orderBy: {
        dueDate: "desc",
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error(
      "Fetch Assignments Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch assignments",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Assignment Payload:", body);

    const {
      title,
      description,
      totalMarks,
      classId,
      subjectId,
      startDate,
      dueDate,
    } = body;

    if (!title || !classId || !subjectId || !startDate || !dueDate) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    const teacher = await prisma.teacher.findFirst();

    if (!teacher) {
      return NextResponse.json(
        {
          error: "Teacher not found",
        },
        {
          status: 404,
        },
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        totalMarks: Number(totalMarks) || 20,

        classId: Number(classId),
        subjectId: Number(subjectId),

        teacherId: teacher.id,

        startDate: new Date(startDate),

        dueDate: new Date(dueDate),
      },

      include: {
        class: true,
        subject: true,
        teacher: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Create Assignment Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create assignment",
      },
      {
        status: 500,
      },
    );
  }
}
