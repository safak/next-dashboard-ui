import { NextResponse } from "next/server";
import { isAttendanceLocked, getTodayUTCDateOnly } from "@/lib/attendanceLock";

export async function GET() {
  const date = getTodayUTCDateOnly();

  const locked = await isAttendanceLocked({
    date,
    isAdmin: false, // 🔒 teacher view
  });

  return NextResponse.json({ locked });
}