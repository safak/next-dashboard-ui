import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const className = request.nextUrl.searchParams.get("className");

    const where: any = {
      teacherId: userId,
    };

    if (className) {
      const selectedClass = await prisma.class.findFirst({
        where: {
          name: className,
        },
      });

      if (!selectedClass) {
        return NextResponse.json([]);
      }

      where.classId = selectedClass.id;
    }

    const exams = await prisma.exam.findMany({
      where,

      include: {
        subject: {
          select: {
            name: true,
          },
        },

        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        examDate: "desc",
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Fetch Exams Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch exams",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    console.log("Exam Payload:", body);

    const { title, description, totalMarks, classId, subjectId, examDate } =
      body;

    if (!title || !classId || !subjectId || !examDate) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,

        totalMarks: Number(totalMarks) || 20,

        classId: Number(classId),

        subjectId: Number(subjectId),

        teacherId: userId,

        examDate: new Date(examDate),
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

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Create Exam Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create exam",
      },
      {
        status: 500,
      },
    );
  }
}
