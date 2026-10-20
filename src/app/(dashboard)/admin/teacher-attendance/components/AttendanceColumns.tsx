"use client";

import Image from "next/image";
import {
  CalendarDays,
  ClipboardPen,
  Clock3,
  Mail,
  Pencil,
  UserRound,
} from "lucide-react";

import StatusBadge from "@/components/admin/StatusBadge";
import { Column } from "@/components/admin/DataTable";

export interface TeacherAttendance {
  teacherId: string;
  attendanceId: number | null;

  name: string;
  surname: string;

  email: string | null;
  phone: string | null;

  img: string | null;

  date: string | null;

  status: string | null;

  remarks: string;

  markedAt: string | null;

  isMarked: boolean;
}

interface AttendanceColumnsProps {
  onMark: (teacher: TeacherAttendance) => void;
  attendanceDisabled?: boolean;
  attendanceBlockReason?: string | null;
}

function getInitials(name: string, surname: string) {
  return `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMarkedTime(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function AttendanceColumns({
  onMark,
  attendanceDisabled = false,
  attendanceBlockReason = null,
}: AttendanceColumnsProps): Column<TeacherAttendance>[] {
  return [
    {
      key: "teacher",
      title: "Teacher",
      width: "28%",
      render: (teacher) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {teacher.img ? (
              <Image
                src={teacher.img}
                alt={`${teacher.name} ${teacher.surname}`}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                {getInitials(teacher.name, teacher.surname)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />

              <p className="truncate font-semibold text-slate-900">
                {teacher.name} {teacher.surname}
              </p>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3 w-3 shrink-0 text-slate-400" />

              <p className="truncate text-xs text-slate-500">
                {teacher.email || "No email"}
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "date",
      title: "Date",
      width: "15%",
      align: "center",
      render: (teacher) => (
        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

          <span>{formatDate(teacher.date)}</span>
        </div>
      ),
    },

    {
      key: "status",
      title: "Status",
      width: "15%",
      align: "center",
      render: (teacher) => (
        <div className="flex justify-center">
          <StatusBadge status={teacher.status ?? "PENDING"} />
        </div>
      ),
    },

    {
      key: "markedAt",
      title: "Marked At",
      width: "14%",
      align: "center",
      render: (teacher) => {
        const markedTime = formatMarkedTime(teacher.markedAt);

        return markedTime ? (
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />

            <span>{markedTime}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-400">Not marked</span>
        );
      },
    },

    {
      key: "remarks",
      title: "Remarks",
      width: "16%",
      render: (teacher) => (
        <div className="max-w-[220px]">
          {teacher.remarks?.trim() ? (
            <p
              className="truncate text-sm text-slate-600"
              title={teacher.remarks}
            >
              {teacher.remarks}
            </p>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          )}
        </div>
      ),
    },

    {
      key: "action",
      title: "Action",
      width: "12%",
      align: "center",
      render: (teacher) => {
        if (attendanceDisabled) {
          return (
            <div className="flex justify-center">
              <button
                type="button"
                disabled
                title={attendanceBlockReason ?? "Attendance is unavailable."}
                className="
          inline-flex
          h-9
          cursor-not-allowed
          items-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-slate-100
          px-3
          text-sm
          font-medium
          text-slate-400
        "
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Unavailable
              </button>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onMark(teacher)}
              className={`
                inline-flex
                h-9
                items-center
                gap-2
                rounded-lg
                px-3
                text-sm
                font-medium
                text-white
                transition
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                ${
                  teacher.isMarked
                    ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400"
                    : "bg-violet-600 hover:bg-violet-700 focus:ring-violet-400"
                }
              `}
            >
              {teacher.isMarked ? (
                <>
                  <Pencil className="h-3.5 w-3.5" />
                  Update
                </>
              ) : (
                <>
                  <ClipboardPen className="h-3.5 w-3.5" />
                  Mark
                </>
              )}
            </button>
          </div>
        );
      },
    },
  ];
}
