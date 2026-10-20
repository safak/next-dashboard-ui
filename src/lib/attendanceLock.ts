import prisma from "@/lib/prisma";

/**
 * School calendar uses India Standard Time.
 * Date strings are kept as YYYY-MM-DD to avoid timezone drift.
 */
export function getISTTime() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );
}

export function getISTDateKey(date: Date = getISTTime()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayUTCDateOnly() {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isSecondSaturday(date: Date) {
  // date is interpreted as a calendar date, not as a local timestamp.
  const dayOfMonth = Number(date.toISOString().slice(8, 10));
  const weekday = date.getUTCDay();

  return weekday === 6 && dayOfMonth >= 8 && dayOfMonth <= 14;
}

export async function getAttendanceCalendarBlock(date: Date) {
  const dateKey = getDateKey(date);
  const [year, month, day] = dateKey.split("-").map(Number);

  // Construct the date in UTC so the weekday is stable.
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = calendarDate.getUTCDay();

  if (weekday === 0) {
    return {
      blocked: true,
      reason: "Attendance cannot be marked on Sundays.",
    };
  }

  if (isSecondSaturday(calendarDate)) {
    return {
      blocked: true,
      reason: "Attendance cannot be marked on the second Saturday.",
    };
  }

  // Query the full-day holiday for this exact calendar date.
  const holiday = await prisma.holiday.findFirst({
    where: {
      date: {
        gte: calendarDate,
        lt: new Date(Date.UTC(year, month - 1, day + 1)),
      },
      isFullDay: true,
    },
    select: {
      title: true,
    },
  });

  if (holiday) {
    return {
      blocked: true,
      reason: `Attendance cannot be marked on the holiday: ${holiday.title}.`,
    };
  }

  return {
    blocked: false,
    reason: null,
  };
}

/**
 * Shared attendance lock.
 *
 * Calendar restrictions apply to everyone, including administrators.
 * The time-based lock applies only to non-admin users.
 */
export async function isAttendanceLocked({
  date,
  isAdmin = false,
}: {
  date: Date;
  isAdmin?: boolean;
}) {
  const calendarBlock = await getAttendanceCalendarBlock(date);

  if (calendarBlock.blocked) {
    return true;
  }

  // Admins may correct ordinary historical dates, but not blocked dates.
  if (isAdmin) {
    return false;
  }

  const today = getISTDateKey();
  const targetDate = getDateKey(date);

  // Non-admin users cannot change previous or future dates.
  if (targetDate !== today) {
    return true;
  }

  const ist = getISTTime();

  // Preserve the existing 4 PM lock and reopen control.
  if (ist.getHours() < 16) {
    return false;
  }

  const todayUTC = getTodayUTCDateOnly();

  const control = await prisma.attendanceControl.findUnique({
    where: {
      date: todayUTC,
    },
  });

  return !control?.isOpen;
}
