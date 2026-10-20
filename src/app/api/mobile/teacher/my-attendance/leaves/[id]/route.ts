import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const leave = await prisma.teacherLeave.findFirst({
      where: {
        id: Number(id),
        teacherId: userId,
      },
    });

    if (!leave) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(leave);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch leave" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();

    const {
      leaveDate,
      leaveType,
      duration,
      reason,
    } = body;

    const leave = await prisma.teacherLeave.findFirst({
      where: {
        id: Number(id),
        teacherId: userId,
      },
    });

    if (!leave) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "Only pending leave requests can be edited.",
        },
        {
          status: 400,
        }
      );
    }

    const [year, month, day] = leaveDate
      .split("-")
      .map(Number);

    const selectedDate = new Date(
      Date.UTC(year, month - 1, day)
    );

    const duplicate = await prisma.teacherLeave.findFirst({
      where: {
        teacherId: userId,
        leaveDate: selectedDate,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error: "Leave already exists for this date.",
        },
        {
          status: 409,
        }
      );
    }

    const updated = await prisma.teacherLeave.update({
      where: {
        id: Number(id),
      },
      data: {
        leaveDate: selectedDate,
        leaveType,
        duration,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Updated Successfully.",
      leave: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update leave",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const leave = await prisma.teacherLeave.findFirst({
      where: {
        id: Number(id),
        teacherId: userId,
      },
    });

    if (!leave) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "Only pending leave requests can be deleted.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.teacherLeave.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete leave",
      },
      {
        status: 500,
      }
    );
  }
}