import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    eventId: string;
    imageId: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { eventId, imageId } = await params;

    const eventIdNumber = Number(eventId);
    const imageIdNumber = Number(imageId);

    if (!Number.isInteger(eventIdNumber) || !Number.isInteger(imageIdNumber)) {
      return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
    }

    const body = await request.json();

    if (typeof body.isPublished !== "boolean") {
      return NextResponse.json(
        { error: "isPublished must be a boolean." },
        { status: 400 },
      );
    }

    const image = await prisma.galleryImage.findFirst({
      where: {
        id: imageIdNumber,
        eventId: eventIdNumber,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Gallery image not found." },
        { status: 404 },
      );
    }

    const updatedImage = await prisma.galleryImage.update({
      where: {
        id: image.id,
      },
      data: {
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json({
      success: true,
      image: updatedImage,
    });
  } catch (error) {
    console.error("Gallery image update error:", error);

    return NextResponse.json(
      { error: "Failed to update gallery image." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { eventId, imageId } = await params;

    const eventIdNumber = Number(eventId);
    const imageIdNumber = Number(imageId);

    if (!Number.isInteger(eventIdNumber) || !Number.isInteger(imageIdNumber)) {
      return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
    }

    const image = await prisma.galleryImage.findFirst({
      where: {
        id: imageIdNumber,
        eventId: eventIdNumber,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Gallery image not found." },
        { status: 404 },
      );
    }

    const relativePath = image.imageUrl.replace(/^\/+/, "");

    const filePath = path.join(process.cwd(), "public", relativePath);

    try {
      await unlink(filePath);
    } catch (error) {
      console.warn("Gallery image file could not be removed:", filePath, error);
    }

    await prisma.galleryImage.delete({
      where: {
        id: image.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Gallery image delete error:", error);

    return NextResponse.json(
      { error: "Failed to delete image." },
      { status: 500 },
    );
  }
}
