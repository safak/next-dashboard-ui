import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAttendanceCalendarBlock, getISTTime } from "@/lib/attendanceLock";
import { sendSMS } from "@/lib/sendSMS";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { className, attendance } = body;

    /* ================= LOCK CHECK ================= */

    const now = new Date();

    const indiaTime = getISTTime();

    const todayKey = [
      indiaTime.getFullYear(),
      String(indiaTime.getMonth() + 1).padStart(2, "0"),
      String(indiaTime.getDate()).padStart(2, "0"),
    ].join("-");

    const attendanceDate = new Date(`${todayKey}T00:00:00.000Z`);

    const calendarBlock = await getAttendanceCalendarBlock(attendanceDate);

    if (calendarBlock.blocked) {
      return NextResponse.json(
        { error: calendarBlock.reason },
        { status: 403 },
      );
    }

    if (indiaTime.getHours() >= 17) {
      return NextResponse.json(
        { error: "Attendance locked after 5 PM" },
        { status: 403 },
      );
    }

    /* ================= CLASS ================= */

    const selectedClass = await prisma.class.findFirst({
      where: {
        name: className,
      },
    });

    if (!selectedClass) {
      return NextResponse.json(
        {
          error: "Class not found",
        },
        {
          status: 404,
        },
      );
    }

    /* ================= SAVE ATTENDANCE ================= */

    const attendanceEntries = Object.entries(attendance);

    for (const [studentId, attendanceValue] of attendanceEntries) {
      const status =
        typeof attendanceValue === "string"
          ? attendanceValue
          : (attendanceValue as any)?.status;

      const remarks =
        typeof attendanceValue === "string"
          ? null
          : (attendanceValue as any)?.remarks || null;

      /* ================= VALIDATION ================= */

      if (!status || !["present", "absent", "leave"].includes(status)) {
        continue;
      }

      /* ================= CHECK EXISTING ================= */

      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          studentId_date: {
            studentId: studentId as string,

            date: attendanceDate,
          },
        },
      });

      /* ================= UPSERT ================= */

      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: studentId as string,

            date: attendanceDate,
          },
        },

        update: {
          status,

          remarks,

          updatedAt: new Date(),

          markedBy: "teacher-mobile",
        },

        create: {
          studentId: studentId as string,

          date: attendanceDate,

          status,

          remarks,

          markedBy: "teacher-mobile",
        },
      });

      /* ================= SMS ONLY FIRST SAVE ================= */

      if (!existingAttendance) {
        const student = await prisma.student.findUnique({
          where: {
            id: studentId as string,
          },

          include: {
            parent: true,
            class: true,
          },
        });

        if (student?.parent?.phone) {
          const message = `TRUE SUNSHINE PRESCHOOL

Dear Parent,

Attendance has been marked for your child.

Student: ${student.name}
Class: ${student.class.name}
Status: ${String(status).toUpperCase()}
${remarks ? `Reason: ${remarks}` : ""}
Date: ${attendanceDate.toLocaleDateString("en-IN")}

Regards,
School Administration
True Sunshine Educational Society`;

          try {
            await sendSMS(student.parent.phone, message);

            console.log(`SMS sent to ${student.parent.phone}`);
          } catch (smsError) {
            console.error("SMS Error:", smsError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully",
    });
  } catch (error) {
    console.error("Attendance Save Error:", error);

    return NextResponse.json(
      {
        error: "Failed to save attendance",
      },
      {
        status: 500,
      },
    );
  }
}
