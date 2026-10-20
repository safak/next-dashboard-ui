import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const leaves = await prisma.teacherLeave.findMany({
      where: {
        teacherId: userId,
      },

      orderBy: {
        leaveDate: "desc",
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch leave requests",
      },
      {
        status: 500,
      }
    );
  }
}