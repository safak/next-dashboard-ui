import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const { userId, role } = await getAuthUser();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const classes = await prisma.class.findMany({
      where: {
        supervisorId: userId,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        capacity: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Fetch Classes Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch classes",
      },
      {
        status: 500,
      }
    );
  }
}