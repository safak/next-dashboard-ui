import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ documentId: string }>;
  },
) {
  try {
    const { documentId } = await params;

    const document = await prisma.studentDocument.findUnique({
      where: {
        id: Number(documentId),
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load document.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ documentId: string }>;
  },
) {
  try {
    const { documentId } = await params;

    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existing = await prisma.studentDocument.findUnique({
      where: {
        id: Number(documentId),
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    // ----------------------------------------------------
    // TODO:
    // Upload the new file to
    // Azure Blob / Cloudinary / AWS S3
    // ----------------------------------------------------

    const fileUrl = `/uploads/${file.name}`;

    const updated = await prisma.studentDocument.update({
      where: {
        id: Number(documentId),
      },
      data: {
        originalFileName: file.name,
        fileUrl,
        uploadedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document replaced successfully.",
      document: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to replace document.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ documentId: string }>;
  },
) {
  try {
    const { documentId } = await params;

    const existing = await prisma.studentDocument.findUnique({
      where: {
        id: Number(documentId),
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    // ----------------------------------------------------
    // TODO:
    // Delete file from Cloudinary / Azure / AWS S3
    // ----------------------------------------------------

    await prisma.studentDocument.delete({
      where: {
        id: Number(documentId),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete document.",
      },
      {
        status: 500,
      },
    );
  }
}
