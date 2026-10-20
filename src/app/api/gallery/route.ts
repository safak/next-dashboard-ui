import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {},
      orderBy: {
        startTime: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        category: true,
        showInGallery: true,

        galleryImages: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            fileName: true,
            imageUrl: true,
            altText: true,
            sortOrder: true,
            isPublished: true,
          },
        },
      },
    });

    return NextResponse.json({
      events,
    });
  } catch (error) {
    console.error("Admin gallery API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load gallery.",
      },
      {
        status: 500,
      },
    );
  }
}
