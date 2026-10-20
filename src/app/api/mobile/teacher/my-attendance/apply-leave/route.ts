import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get teacher details
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        surname: true,
      },
    });

    const teacherName =
      `${teacher?.name ?? ""} ${teacher?.surname ?? ""}`.trim() || "Teacher";

    const body = await req.json();

    const { leaveDate, leaveType, duration, reason } = body;

    // -------------------------------
    // Validation
    // -------------------------------

    if (!leaveDate || !leaveType || !duration || !reason) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const [year, month, day] = leaveDate.split("-").map(Number);

    const selectedDate = new Date(
      Date.UTC(year, month - 1, day)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        {
          error: "Leave date cannot be in the past",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------------
    // Already Applied?
    // -------------------------------

    const existingLeave = await prisma.teacherLeave.findUnique({
      where: {
        teacherId_leaveDate: {
          teacherId: userId,
          leaveDate: selectedDate,
        },
      },
    });

    if (existingLeave) {
      // Re-submit cancelled leave
      if (existingLeave.status === "CANCELLED") {
        const updatedLeave = await prisma.teacherLeave.update({
          where: {
            id: existingLeave.id,
          },
          data: {
            leaveType,
            duration,
            reason,
            status: "PENDING",
            approvedBy: null,
            approvedAt: null,
            rejectionReason: null,
          },
        });

        // Create notification for Admin
        await prisma.notification.create({
          data: {
            title: "New Leave Request",
            message: `${teacherName} applied ${leaveType} leave.`,
            type: "TEACHER_LEAVE",
            referenceId: updatedLeave.id,
            isRead: false,
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Leave applied successfully.",
            leave: updatedLeave,
          },
          {
            status: 200,
          }
        );
      }

      return NextResponse.json(
        {
          error: "Leave already applied for this date",
        },
        {
          status: 409,
        }
      );
    }

    // -------------------------------
    // Create Leave
    // -------------------------------

    const leave = await prisma.teacherLeave.create({
      data: {
        teacherId: userId,
        leaveDate: selectedDate,
        leaveType,
        duration,
        reason,
        status: "PENDING",
      },
    });

    // -------------------------------
    // Create Notification
    // -------------------------------

    await prisma.notification.create({
      data: {
        title: "New Leave Request",
        message: `${teacherName} applied ${leaveType} leave.`,
        type: "TEACHER_LEAVE",
        referenceId: leave.id,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Leave applied submitted successfully.",
        leave,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Submit Leave Error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit leave request",
      },
      {
        status: 500,
      }
    );
  }
}