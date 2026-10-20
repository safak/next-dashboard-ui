import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAttendanceCalendarBlock } from "@/lib/attendanceLock";
import { prisma } from "@/lib/prisma";

function getAttendanceDate(value?: string | null) {
  if (value) {
    const [year, month, day] = value.split("-").map(Number);

    if (
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      Number.isInteger(day)
    ) {
      return new Date(Date.UTC(year, month - 1, day));
    }
  }

  const now = new Date();

  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function formatDateOnly(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const requestedDate = searchParams.get("date");

    const attendanceDate = getAttendanceDate(requestedDate);

    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        img: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const attendance = await prisma.teacherAttendance.findMany({
      where: {
        date: attendanceDate,
      },
      select: {
        id: true,
        teacherId: true,
        date: true,
        status: true,
        remarks: true,
        markedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const teacherAttendance = teachers.map((teacher) => {
      const record = attendance.find((item) => item.teacherId === teacher.id);

      return {
        teacherId: teacher.id,
        attendanceId: record?.id ?? null,

        name: teacher.name,
        surname: teacher.surname,

        email: teacher.email,
        phone: teacher.phone,
        img: teacher.img,

        date: record?.date
          ? formatDateOnly(record.date)
          : requestedDate || formatDateOnly(attendanceDate),

        status: record?.status ?? "NOT_MARKED",

        remarks: record?.remarks ?? "",

        markedAt: record?.createdAt ? record.createdAt.toISOString() : null,

        isMarked: Boolean(record),
      };
    });

    const summary = {
      totalTeachers: teachers.length,

      present: teacherAttendance.filter(
        (teacher) => teacher.status === "PRESENT",
      ).length,

      absent: teacherAttendance.filter((teacher) => teacher.status === "ABSENT")
        .length,

      late: teacherAttendance.filter((teacher) => teacher.status === "LATE")
        .length,

      leave: teacherAttendance.filter((teacher) => teacher.status === "LEAVE")
        .length,

      pending: teacherAttendance.filter(
        (teacher) => teacher.status === "NOT_MARKED",
      ).length,
    };

    return NextResponse.json({
      date: requestedDate || formatDateOnly(attendanceDate),
      summary,
      teachers: teacherAttendance,
    });
  } catch (error) {
    console.error("Teacher Attendance Dashboard Error:", error);

    return NextResponse.json(
      {
        error: "Failed to load teacher attendance",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { teacherId, attendanceId, status, remarks, date } = body;

    if (!teacherId || !status) {
      return NextResponse.json(
        {
          error: "Teacher and status are required.",
        },
        {
          status: 400,
        },
      );
    }

    const attendanceDate = getAttendanceDate(date);

    const calendarBlock = await getAttendanceCalendarBlock(attendanceDate);

    if (calendarBlock.blocked) {
      return NextResponse.json(
        {
          success: false,
          error: calendarBlock.reason,
        },
        {
          status: 403,
        },
      );
    }

    let attendance;

    if (attendanceId) {
      attendance = await prisma.teacherAttendance.update({
        where: {
          id: Number(attendanceId),
        },
        data: {
          status,
          remarks: remarks?.trim() ?? "",
          markedBy: userId,
        },
      });
    } else {
      attendance = await prisma.teacherAttendance.create({
        data: {
          teacherId,
          date: attendanceDate,
          status,
          remarks: remarks?.trim() ?? "",
          markedBy: userId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Save Attendance Error:", error);

    return NextResponse.json(
      {
        error: "Failed to save attendance.",
      },
      {
        status: 500,
      },
    );
  }
}
