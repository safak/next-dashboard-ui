import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const records = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startMonth,
      },
    },
    include: {
      student: {
        include: {
          class: true,
        },
      },
    },
  });

  const classMap: Record<string, { present: number; total: number }> = {};

  records.forEach((r) => {
    const className = r.student.class.name;

    if (!classMap[className]) {
      classMap[className] = { present: 0, total: 0 };
    }

    classMap[className].total += 1;

    if (r.status === "present") {
      classMap[className].present += 1;
    }
  });

  const data = Object.entries(classMap).map(([cls, val]) => ({
    class: cls,
    percentage: Math.round((val.present / val.total) * 100),
  }));

  return NextResponse.json(data);
}