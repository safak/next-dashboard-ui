import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const records = await prisma.attendance.findMany({
    include: {
      student: true,
    },
  });

  const map: Record<
    string,
    { name: string; present: number; total: number }
  > = {};

  records.forEach((r) => {
    const id = r.studentId;

    if (!map[id]) {
      map[id] = {
        name: r.student.name,
        present: 0,
        total: 0,
      };
    }

    map[id].total++;

    if (r.status === "present") {
      map[id].present++;
    }
  });

  const data = Object.values(map).map((s) => ({
    ...s,
    percentage: Math.round((s.present / s.total) * 100),
  }));

  return NextResponse.json(data);
}