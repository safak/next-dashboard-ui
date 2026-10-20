import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch subjects",
      },
      {
        status: 500,
      }
    );
  }
}