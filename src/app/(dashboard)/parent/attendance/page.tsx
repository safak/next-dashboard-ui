import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import MobileMonthDropdown from "@/components/mobile/common/MobileMonthDropdown";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  XCircle,
} from "lucide-react";

type Props = {
  searchParams: Promise<{
    studentId?: string;
    month?: string;
    year?: string;
  }>;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonth = new Date().getMonth();

const months = Array.from({ length: currentMonth + 1 }, (_, index) =>
  new Date(0, index).toLocaleString("default", {
    month: "short",
  }),
);

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "present":
      return "Present";

    case "absent":
      return "Absent";

    case "late":
      return "Late";

    case "leave":
    case "on_leave":
      return "Leave";

    default:
      return status;
  }
}

export default async function ParentAttendancePage({ searchParams }: Props) {
  const params = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
    include: {
      class: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-24">
        <main className="px-4 pt-5">
          <Link
            href="/parent"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#4B517D]
              shadow-sm
            "
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div
            className="
              mt-6
              rounded-[22px]
              border
              border-slate-100
              bg-white
              px-5
              py-10
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#E7ECF8]
                text-[#4B517D]
              "
            >
              <CalendarDays className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-[#4B517D]">
              No children found
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              No student profiles are linked to your account.
            </p>
          </div>
        </main>

        <ParentMobileBottomNav />
      </div>
    );
  }

  const activeId = params.studentId || students[0].id;

  const student = students.find((item) => item.id === activeId) || students[0];

  const now = new Date();

  const selectedMonthNumber = Math.min(
    12,
    Math.max(1, Number(params.month) || now.getMonth() + 1),
  );

  const selectedYear = Number(params.year) || now.getFullYear();

  /*
   * IMPORTANT:
   * Keep the same short month format used by Teacher My Attendance.
   *
   * September = "Sep"
   * NOT "Sept"
   */
  const selectedMonth = new Date(0, selectedMonthNumber - 1).toLocaleString(
    "default",
    {
      month: "short",
    },
  );

  const monthStart = new Date(
    selectedYear,
    selectedMonthNumber - 1,
    1,
    0,
    0,
    0,
    0,
  );

  const monthEnd = new Date(
    selectedYear,
    selectedMonthNumber,
    0,
    23,
    59,
    59,
    999,
  );

  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: student.id,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const presentCount = attendance.filter(
    (item) => item.status.toLowerCase() === "present",
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status.toLowerCase() === "absent",
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status.toLowerCase() === "late",
  ).length;

  const leaveCount = attendance.filter((item) => {
    const status = item.status.toLowerCase();

    return status === "leave" || status === "on_leave";
  }).length;

  const childName = student.name?.trim() || "Student";

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      <main className="px-4 pt-5">
        {/* ================= TOP BAR ================= */}

        <div className="flex items-center justify-between">
          <Link
            href={`/parent?studentId=${encodeURIComponent(student.id)}`}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-white
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
            "
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </Link>

          <MobileMonthDropdown
            selectedMonth={selectedMonth}
            months={months}
            studentId={student.id}
            year={selectedYear}
          />
        </div>

        {/* ================= TITLE ================= */}

        <div className="mt-7">
          <div className="flex items-center gap-2">
            <h1
              className="
        text-[22px]
        font-bold
        leading-tight
        tracking-tight
        text-slate-950
      "
            >
              {childName} - {student.class?.name || "Class"}
            </h1>

            <CalendarDays className="h-5 w-5 text-[#4B517D]" />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Attendance performance & history
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}

        <section className="mt-4 grid grid-cols-2 gap-2.5">
          <div
            className="
              rounded-[16px]
              border
              border-emerald-100
              bg-emerald-50
              p-3
            "
          >
            <div className="flex items-start justify-between">
              <p className="text-[9px] font-medium text-emerald-700">Present</p>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-100
                  text-emerald-600
                "
              >
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-2 text-[22px] font-bold leading-none text-slate-950">
              {presentCount}
            </p>
          </div>

          <div
            className="
              rounded-[16px]
              border
              border-red-100
              bg-red-50
              p-3
            "
          >
            <div className="flex items-start justify-between">
              <p className="text-[9px] font-medium text-red-700">Absent</p>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-red-100
                  text-red-600
                "
              >
                <XCircle className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-2 text-[22px] font-bold leading-none text-slate-950">
              {absentCount}
            </p>
          </div>

          <div
            className="
              rounded-[16px]
              border
              border-amber-100
              bg-amber-50
              p-3
            "
          >
            <div className="flex items-start justify-between">
              <p className="text-[9px] font-medium text-amber-700">Late</p>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-amber-100
                  text-amber-600
                "
              >
                <Clock3 className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-2 text-[22px] font-bold leading-none text-slate-950">
              {lateCount}
            </p>
          </div>

          <div
            className="
              rounded-[16px]
              border
              border-blue-100
              bg-blue-50
              p-3
            "
          >
            <div className="flex items-start justify-between">
              <p className="text-[9px] font-medium text-blue-700">Leaves</p>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                  text-blue-600
                "
              >
                <Plane className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-2 text-[22px] font-bold leading-none text-slate-950">
              {leaveCount}
            </p>
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <section className="mt-5">
          <div className="flex items-end justify-between">
            <div>
              <h2
                className="
                  text-[16px]
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                Recent Activity
              </h2>

              <p className="mt-1 text-[9px] text-slate-400">
                Attendance & history
              </p>
            </div>

            <span className="text-[9px] font-medium text-[#4B517D]">
              {attendance.length} Records
            </span>
          </div>

          <div className="mt-3">
            {attendance.length === 0 ? (
              <div
                className="
                  rounded-[20px]
                  border
                  border-slate-100
                  bg-white
                  px-5
                  py-9
                  text-center
                  shadow-sm
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#E7ECF8]
                    text-[#4B517D]
                  "
                >
                  <CalendarDays className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#4B517D]">
                  No attendance records
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  No attendance has been recorded for{" "}
                  {monthNames[selectedMonthNumber - 1]}.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {attendance.map((record) => {
                  const status = record.status.toLowerCase();

                  const isPresent = status === "present";

                  const isAbsent = status === "absent";

                  const isLate = status === "late";

                  const isLeave = status === "leave" || status === "on_leave";

                  const iconBg = isPresent
                    ? "bg-emerald-100"
                    : isAbsent
                      ? "bg-red-100"
                      : isLate
                        ? "bg-amber-100"
                        : isLeave
                          ? "bg-blue-100"
                          : "bg-slate-100";

                  const iconColor = isPresent
                    ? "text-emerald-600"
                    : isAbsent
                      ? "text-red-600"
                      : isLate
                        ? "text-amber-600"
                        : isLeave
                          ? "text-blue-600"
                          : "text-slate-600";

                  const badgeBg = isPresent
                    ? "bg-emerald-100"
                    : isAbsent
                      ? "bg-red-100"
                      : isLate
                        ? "bg-amber-100"
                        : isLeave
                          ? "bg-blue-100"
                          : "bg-slate-100";

                  const badgeColor = isPresent
                    ? "text-emerald-700"
                    : isAbsent
                      ? "text-red-700"
                      : isLate
                        ? "text-amber-700"
                        : isLeave
                          ? "text-blue-700"
                          : "text-slate-700";

                  const Icon = isPresent
                    ? CheckCircle2
                    : isAbsent
                      ? XCircle
                      : isLate
                        ? Clock3
                        : isLeave
                          ? Plane
                          : CalendarDays;

                  return (
                    <div
                      key={record.id}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-[18px]
                        border
                        border-slate-100
                        bg-white
                        p-3
                        shadow-sm
                      "
                    >
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${iconBg}
                          ${iconColor}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <h3 className="text-[11px] font-bold text-slate-800">
                              {getStatusLabel(record.status)}
                            </h3>

                            <p className="mt-0.5 text-[9px] text-slate-400">
                              {formatDate(new Date(record.date))}
                            </p>
                          </div>

                          <span
                            className={`
                              rounded-full
                              px-2
                              py-1
                              text-[8px]
                              font-bold
                              ${badgeBg}
                              ${badgeColor}
                            `}
                          >
                            {getStatusLabel(record.status)}
                          </span>
                        </div>

                        {record.remarks && (
                          <p className="mt-1 truncate text-[9px] text-slate-400">
                            {record.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <ParentMobileBottomNav studentId={student.id} />
    </div>
  );
}
