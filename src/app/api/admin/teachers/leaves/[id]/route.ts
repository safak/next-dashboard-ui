import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { LeaveDuration, LeaveStatus, LeaveType } from "@prisma/client";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/* =========================================================
   GET SINGLE LEAVE REQUEST
========================================================= */

export async function GET(
  request: NextRequest,
  { params }: RouteContext
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

    const leave = await prisma.teacherLeave.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            img: true,
          },
        },
      },
    });

    if (!leave) {
      return NextResponse.json(
        {
          error: "Leave request not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      leave,
    });
  } catch (error) {
    console.error("Get Leave Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch leave request.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE LEAVE REQUEST
========================================================= */

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
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

    const body = await request.json();

    const {
      leaveDate,
      leaveType,
      duration,
      reason,
      status,
    }: {
      leaveDate?: string;
      leaveType?: LeaveType;
      duration?: LeaveDuration;
      reason?: string;
      status?: LeaveStatus;
    } = body;

    const existingLeave = await prisma.teacherLeave.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingLeave) {
      return NextResponse.json(
        {
          error: "Leave request not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedLeave = await prisma.teacherLeave.update({
      where: {
        id: Number(id),
      },
      data: {
        leaveDate: leaveDate ? new Date(leaveDate) : undefined,
        leaveType,
        duration,
        reason,
        status,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            img: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Leave request updated successfully.",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("Update Leave Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update leave request.",
      },
      {
        status: 500,
      }
    );
  }
}
