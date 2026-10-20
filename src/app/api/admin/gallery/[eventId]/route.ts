import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ eventId: string }>;
  },
) {
  try {
    const { eventId } = await params;
    const id = Number(eventId);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid event ID." }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
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

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Gallery event GET error:", error);

    return NextResponse.json(
      { error: "Failed to load event gallery." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ eventId: string }>;
  },
) {
  try {
    const { eventId } = await params;
    const id = Number(eventId);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid event ID." }, { status: 400 });
    }

    const body = await request.json();

    if (typeof body.showInGallery !== "boolean") {
      return NextResponse.json(
        { error: "Invalid visibility value." },
        { status: 400 },
      );
    }

    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        showInGallery: body.showInGallery,
      },
      select: {
        id: true,
        showInGallery: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Gallery visibility error:", error);

    return NextResponse.json(
      { error: "Failed to update gallery visibility." },
      { status: 500 },
    );
  }
}
