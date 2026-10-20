import { NextRequest, NextResponse } from "next/server";
import { getAttendanceCalendarBlock } from "@/lib/attendanceLock";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "A valid date in YYYY-MM-DD format is required." },
        { status: 400 },
      );
    }

    const [year, month, day] = date.split("-").map(Number);
    const calendarDate = new Date(Date.UTC(year, month - 1, day));

    // Reject invalid dates such as 2026-02-30.
    if (
      calendarDate.getUTCFullYear() !== year ||
      calendarDate.getUTCMonth() !== month - 1 ||
      calendarDate.getUTCDate() !== day
    ) {
      return NextResponse.json(
        { error: "Invalid calendar date." },
        { status: 400 },
      );
    }

    const result = await getAttendanceCalendarBlock(calendarDate);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Attendance calendar status error:", error);

    return NextResponse.json(
      { error: "Unable to check the attendance calendar." },
      { status: 500 },
    );
  }
}
