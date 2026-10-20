import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";

export async function GET() {
  try {
    // 🔐 SECURE: role + DB validation
    const teacher = await requireTeacher();

    // 🔥 Get teacher classes
    const classes = await prisma.class.findMany({
      where: { supervisorId: teacher.id },
      select: { id: true },
    });

    const classIds = classes.map((c) => c.id);

    // ✅ Optimization
    if (classIds.length === 0) {
      return NextResponse.json([]);
    }

    const today = new Date();

    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const data = await Promise.all(
      days.map(async (day) => {
        const next = new Date(day);
        next.setDate(day.getDate() + 1);

        const records = await prisma.attendance.findMany({
          where: {
            date: { gte: day, lt: next },
            student: {
              classId: { in: classIds }, // 🔒 scoped to teacher
            },
          },
        });

        const present = records.filter(
          (r) => r.status === "present"
        ).length;

        const percentage =
          records.length === 0
            ? 0
            : Math.round((present / records.length) * 100);

        return {
          date: day.toISOString(),
          percentage,
        };
      })
    );

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 403 }
    );
  }
}