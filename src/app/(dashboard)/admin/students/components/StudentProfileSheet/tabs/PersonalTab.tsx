"use client";

import {
  User,
  Venus,
  Droplets,
  CalendarDays,
} from "lucide-react";

import type { Student } from "@/types/student";

interface PersonalTabProps {
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
    <div className="flex items-start gap-3 border-b border-slate-100 py-3.5">
      {/* Icon */}

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200">
        {icon}
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function PersonalTab({
  student,
}: PersonalTabProps) {
  const dob = student.birthday
    ? new Date(student.birthday).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <div className="space-y-5">
      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Personal Information
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Basic details of the student.
        </p>
      </div>

      {/* ==================================================
          INFORMATION
      ================================================== */}

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        <InfoItem
          icon={<User className="h-4 w-4" />}
          label="Full Name"
          value={student.fullName}
        />

        <InfoItem
          icon={<Venus className="h-4 w-4" />}
          label="Gender"
          value={student.gender}
        />

        <InfoItem
          icon={<Droplets className="h-4 w-4" />}
          label="Blood Group"
          value={student.bloodType}
        />

        <InfoItem
          icon={<CalendarDays className="h-4 w-4" />}
          label="Date of Birth"
          value={dob}
        />
      </div>
    </div>
  );
}