import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: userId,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.notification.deleteMany({
      where: {
        type: "TEACHER_LEAVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "All notifications cleared successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to clear notifications",
      },
      {
        status: 500,
      }
    );
  }
}