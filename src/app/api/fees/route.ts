
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/getSessionUser";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { classId, title, annualFee, admissionFee = 11500 } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      !Number.isInteger(annualFee) ||
      annualFee < 0 ||
      !Number.isInteger(classId) ||
      classId <= 0 ||
      !Number.isInteger(admissionFee) ||
      admissionFee < 0
    ) {
      return NextResponse.json(
        { error: "Invalid or missing fee details." },
        { status: 400 },
      );
    }

    const feeStructure = await prisma.feeStructure.create({
      data: {
        title: title.trim(),
        annualFee,
        admissionFee,
        classId,
        isActive: true,
      },
    });

    return NextResponse.json(
      { success: true, feeStructure },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create fee structure:", error);

    return NextResponse.json(
      { error: "Failed to create fee structure." },
      { status: 500 },
    );
  }
}
