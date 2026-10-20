import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { LeaveStatus } from "@prisma/client";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    /* ================= AUTH ================= */

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ================= PARAMS ================= */

    const { id } = await params;

    /* ================= BODY ================= */

    const body = await request.json();

    const { rejectionReason }: { rejectionReason: string } = body;

    if (!rejectionReason?.trim()) {
      return NextResponse.json(
        {
          error: "Rejection reason is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* ================= FIND LEAVE ================= */

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

    /* ================= VALIDATIONS ================= */

    if (leave.status === LeaveStatus.REJECTED) {
      return NextResponse.json(
        {
          error: "Leave request is already rejected.",
        },
        {
          status: 400,
        }
      );
    }

    if (leave.status === LeaveStatus.APPROVED) {
      return NextResponse.json(
        {
          error: "Approved leave request cannot be rejected.",
        },
        {
          status: 400,
        }
      );
    }

    if (leave.status === LeaveStatus.CANCELLED) {
      return NextResponse.json(
        {
          error: "Cancelled leave request cannot be rejected.",
        },
        {
          status: 400,
        }
      );
    }

    /* ================= REJECT ================= */

    const updatedLeave = await prisma.teacherLeave.update({
      where: {
        id: leave.id,
      },
      data: {
        status: LeaveStatus.REJECTED,
        approvedBy: userId,
        approvedAt: new Date(),
        rejectionReason: rejectionReason.trim(),
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

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      message: "Leave request rejected successfully.",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("Reject Leave Error:", error);

    return NextResponse.json(
      {
        error: "Failed to reject leave request.",
      },
      {
        status: 500,
      }
    );
  }
}