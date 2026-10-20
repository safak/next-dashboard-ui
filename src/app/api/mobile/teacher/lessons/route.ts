import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },

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

      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch lessons",
      },
      {
        status: 500,
      }
    );
  }
}