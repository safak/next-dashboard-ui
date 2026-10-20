"use client";

import { BadgeCheck, CalendarDays, School } from "lucide-react";

import type { Student } from "@/types/student";

interface AcademicTabProps {
  student: Student;
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-slate-100 py-3.5">
      {/* Icon */}

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200">
        {icon}
      </div>

      {/* Content */}

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function AcademicTab({ student }: AcademicTabProps) {
  const admissionDate = student.admissionDate
    ? new Date(student.admissionDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const isActive = student.status === "ACTIVE";

  return (
    <div className="space-y-4">
      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">
          Academic Information
        </h3>

        <p className="text-xs text-slate-500">Admission and class details.</p>
      </div>

      {/* ==================================================
          INFORMATION
      ================================================== */}

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {/* Class */}

        <InfoItem
          icon={<School className="h-4 w-4" />}
          label="Class"
          value={student.className}
        />

        {/* Academic Year */}

        <InfoItem
          icon={<CalendarDays className="h-4 w-4" />}
          label="Academic Year"
          value={student.academicYear}
        />

        {/* Admission Date */}

        <InfoItem
          icon={<CalendarDays className="h-4 w-4" />}
          label="Admission Date"
          value={admissionDate}
        />

        {/* Status */}

        <div className="flex min-w-0 items-center gap-3 border-b border-slate-100 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200">
            <BadgeCheck className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <div className="mt-1">
              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  ring-1
                  ring-inset
                  ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-red-50 text-red-700 ring-red-200"
                  }
                `}
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${isActive ? "bg-emerald-500" : "bg-red-500"}
                  `}
                />

                {student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}

      <div className="pb-4" />
    </div>
  );
}
