import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lessonId, attendance } = await req.json();

    const entries = Object.entries(attendance).map(
      ([studentId, present]) => ({
        studentId: studentId,
        lessonId: Number(lessonId),
        status: present ? "PRESENT" : "ABSENT", // ✅ FIX
        date: new Date(),
      })
    );

    await prisma.attendance.createMany({
      data: entries,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}