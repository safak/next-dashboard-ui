import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    const folder =
      (formData.get("folder") as string) ??
      "true-sunshine/students";

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,

          resource_type: "auto",

          use_filename: true,

          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    return NextResponse.json({
      originalFileName: file.name,

      fileUrl: result.secure_url,

      publicId: result.public_id,

      mimeType: file.type,

      fileSize: file.size,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      },
    );
  }
}