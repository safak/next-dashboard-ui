import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(
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

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json(
        { error: "No images selected." },
        { status: 400 },
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "gallery",
      String(id),
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const existingCount = await prisma.galleryImage.count({
      where: {
        eventId: id,
      },
    });

    const uploadedImages = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      if (!(file instanceof File)) {
        continue;
      }

      if (!ALLOWED_TYPES.has(file.type)) {
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        continue;
      }

      const extension =
        file.type === "image/jpeg"
          ? ".jpg"
          : file.type === "image/png"
            ? ".png"
            : ".webp";

      const fileName = `${crypto.randomUUID()}${extension}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(path.join(uploadDirectory, fileName), buffer);

      const image = await prisma.galleryImage.create({
        data: {
          eventId: id,
          fileName,
          imageUrl: `/uploads/gallery/${id}/${fileName}`,
          altText: formData.get("altText")?.toString() || null,
          sortOrder: existingCount + index,
          isPublished: true,
        },
      });

      uploadedImages.push(image);
    }

    return NextResponse.json(
      {
        success: true,
        images: uploadedImages,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Gallery upload error:", error);

    return NextResponse.json(
      { error: "Failed to upload images." },
      { status: 500 },
    );
  }
}
