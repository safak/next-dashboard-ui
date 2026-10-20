import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/* =========================================================
   GET Announcement Details
========================================================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const announcement = await prisma.announcement.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        class: {
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
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Announcement GET Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch announcement",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   UPDATE Announcement
========================================================= */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const body = await request.json();

    const {
      title,
      description,
      priority,
      publishDate,
      expiryDate,
      classId,
    } = body;

    const announcement =
      await prisma.announcement.update({
        where: {
          id: Number(id),
        },

        data: {
          title,
          description,
          priority,

          publishDate: publishDate
            ? new Date(publishDate)
            : undefined,

          expiryDate: expiryDate
            ? new Date(expiryDate)
            : null,

          classId: classId
            ? Number(classId)
            : null,
        },

        include: {
          class: true,
        },
      });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Announcement UPDATE Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update announcement",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   DELETE Announcement
========================================================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    await prisma.announcement.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Announcement DELETE Error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete announcement",
      },
      {
        status: 500,
      },
    );
  }
}