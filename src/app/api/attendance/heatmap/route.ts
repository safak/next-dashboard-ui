export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function getMonthUTCRange() {
  const now = new Date();

  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    1,
    0, 0, 0, 0
  ));

  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    0,
    23, 59, 59, 999
  ));

  return { start, end };
}

export async function GET() {
  const { start, end } = getMonthUTCRange();

  const records = await prisma.attendance.findMany({
    where: {
      date: { gte: start, lte: end },
    },
  });

  const map: Record<string, { present: number; total: number }> = {};

  records.forEach((r) => {
    const key = r.date.toISOString().split("T")[0];

    if (!map[key]) {
      map[key] = { present: 0, total: 0 };
    }

    map[key].total++;

    if (r.status === "present") {
      map[key].present++;
    }
  });

  const data = Object.entries(map).map(([date, val]) => ({
    date,
    percentage:
      val.total === 0 ? 0 : Math.round((val.present / val.total) * 100),
  }));

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}