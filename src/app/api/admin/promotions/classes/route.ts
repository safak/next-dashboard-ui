import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const academicYearId = Number(searchParams.get("academicYearId"));

    if (!academicYearId) {
      return NextResponse.json(
        {
          success: false,
          message: "Academic year is required.",
        },
        { status: 400 },
      );
    }

    const classes = await prisma.class.findMany({
      where: {
        academicYearId,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load classes.",
      },
      { status: 500 },
    );
  }
}