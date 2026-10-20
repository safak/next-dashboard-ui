import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        {
          error: "publicId is required",
        },
        {
          status: 400,
        },
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete document",
      },
      {
        status: 500,
      },
    );
  }
}