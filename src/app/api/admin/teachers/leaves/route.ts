import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { LeaveStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status") as LeaveStatus | null;

    const where = status
      ? {
          status,
        }
      : {};

    const leaves = await prisma.teacherLeave.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            img: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          leaveDate: "desc",
        },
      ],
    });

    const summary = {
      total: leaves.length,

      pending: leaves.filter((leave) => leave.status === "PENDING").length,

      approved: leaves.filter((leave) => leave.status === "APPROVED").length,

      rejected: leaves.filter((leave) => leave.status === "REJECTED").length,

      cancelled: leaves.filter((leave) => leave.status === "CANCELLED").length,
    };

    const formattedLeaves = leaves.map((leave) => ({
      id: leave.id,

      teacherId: leave.teacherId,

      teacherName:
        `${leave.teacher.name} ${leave.teacher.surname ?? ""}`.trim(),

      teacherImage: leave.teacher.img,

      phone: leave.teacher.phone,

      email: leave.teacher.email,

      leaveDate: leave.leaveDate,

      leaveType: leave.leaveType,

      duration: leave.duration,

      reason: leave.reason,

      status: leave.status,

      approvedBy: leave.approvedBy,

      approvedAt: leave.approvedAt,

      rejectionReason: leave.rejectionReason,
    }));

    return NextResponse.json({
      summary,
      leaves: formattedLeaves,
    });
  } catch (error) {
    console.error("Teacher Leave Dashboard Error:", error);

    return NextResponse.json(
      {
        error: "Failed to load teacher leave requests.",
      },
      {
        status: 500,
      },
    );
  }
}
