"use client";

import Image from "next/image";
import { Phone, Clock } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

interface TeacherAttendance {
  teacherId: string;
  attendanceId: number | null;

  name: string;
  surname: string;

  email: string | null;
  phone: string | null;

  img: string | null;

  status: string | null;

  remarks: string;

  markedAt: string | null;

  isMarked: boolean;
}

interface AttendanceCardProps {
  teacher: TeacherAttendance;
  onMark: () => void;
}

export default function AttendanceCard({
  teacher,
  onMark,
}: AttendanceCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border bg-slate-100">
          {teacher.img ? (
            <Image
              src={teacher.img}
              alt={teacher.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-600">
              {teacher.name.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            {teacher.name} {teacher.surname}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {teacher.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} />
                {teacher.phone}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock size={14} />
              {teacher.markedAt
                ? new Date(teacher.markedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--"}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <StatusBadge status={teacher.status} />

        <button
          onClick={onMark}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
            teacher.isMarked
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-violet-600 hover:bg-violet-700"
          }`}
        >
          {teacher.isMarked ? "Update" : "Mark"}
        </button>
      </div>
    </div>
  );
}