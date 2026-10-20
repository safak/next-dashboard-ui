import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function getTodayUTCRange() {
  const now = new Date();

  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));

  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

  return { start, end };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classId = Number(searchParams.get("classId"));

  const { start, end } = getTodayUTCRange();

  const attendance = await prisma.attendance.findMany({
    where: {
      date: { gte: start, lte: end },
      student: { classId },
    },
    select: {
      studentId: true,
      status: true,
    },
  });

  const map: Record<string, string> = {};

  attendance.forEach((a) => {
    map[a.studentId] = a.status;
  });

  return NextResponse.json(map);
}