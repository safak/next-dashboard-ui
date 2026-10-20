import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const announcements =
      await prisma.announcement.findMany({
        where: {
          teacherId: userId,
        },

        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          publishDate: "desc",
        },
      });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error(
      "Get Announcements Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch announcements",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const {
      title,
      description,
      classId,
      priority,
      publishDate,
      expiryDate,
    } = body;

    if (
      !title ||
      !description ||
      !classId ||
      !publishDate
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

    // Verify teacher supervises this class

    const assignedClass =
      await prisma.class.findFirst({
        where: {
          id: Number(classId),
          supervisorId: userId,
        },
      });

    if (!assignedClass) {
      return NextResponse.json(
        {
          error:
            "You are not assigned to this class",
        },
        {
          status: 403,
        }
      );
    }

    const announcement =
      await prisma.announcement.create({
        data: {
          title,
          description,

          priority:
            priority ?? "NORMAL",

          publishDate:
            new Date(
              publishDate
            ),

          expiryDate: expiryDate
            ? new Date(
                expiryDate
              )
            : null,

          isPublished: true,

          teacherId: userId,

          classId:
            Number(classId),

          createdByRole:
            "TEACHER",
        },

        include: {
          class: true,
        },
      });

    return NextResponse.json(
      announcement
    );
  } catch (error) {
    console.error(
      "Create Announcement Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create announcement",
      },
      {
        status: 500,
      }
    );
  }
}