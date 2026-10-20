import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isAttendanceLocked, getTodayUTCDateOnly } from "@/lib/attendanceLock";
import { sendSMS } from "@/lib/sendSMS";

export async function POST(req: Request) {
  try {
    const { studentId, status } = await req.json();

    const date = getTodayUTCDateOnly();

    // 🔐 TODO: replace with real role
    const isAdmin = false;

    const locked = await isAttendanceLocked({ date, isAdmin });

    if (locked) {
      return NextResponse.json(
        { error: "Attendance is locked" },
        { status: 403 },
      );
    }

    // 🔥 CHECK EXISTING (IMPORTANT FOR SMS CONTROL)
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
    });

    // 🔥 UPSERT ATTENDANCE
    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
      update: { status },
      create: {
        studentId,
        status,
        date,
      },
    });

    // =========================
    // 📩 SMS LOGIC (SAFE)
    // =========================

    // ✅ Send SMS only if:
    // 1. New record OR
    // 2. Status changed
    const shouldSendSMS = !existing || existing.status !== status;

    if (shouldSendSMS) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          parent: true,
          class: true, // ✅ ADD THIS
        },
      });

      const phone = student?.parent?.phone;
      const today = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (phone) {
        const message =
          status === "present"
            ? `Dear Parent, your child ${student.name} of class ${student.class?.name || "-"} was present on ${today}. Thank you for your support.\n- True Sunshine Preschool`
            : `Dear Parent, your child ${student.name} of class ${student.class?.name || "-"} was absent on ${today}. Kindly ensure regular attendance.\n- True Sunshine Preschool`;

        // 🔥 SEND SMS (non-blocking)
        sendSMS(phone, message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 },
    );
  }
}
