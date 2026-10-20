import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const examId = Number(id);

    if (!examId) {
      return NextResponse.json(
        {
          error: "Invalid exam ID",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.exam.delete({
      where: {
        id: examId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete Exam Error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete exam",
      },
      {
        status: 500,
      },
    );
  }
}