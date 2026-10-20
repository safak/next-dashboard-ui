"use client";

import { Mail, MapPin, Phone, User } from "lucide-react";

import type { Student } from "@/types/student";

interface ParentTabProps {
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

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function ParentTab({ student }: ParentTabProps) {
  return (
    <div className="space-y-4">
      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">
          Parent Information
        </h3>

        <p className="text-xs text-slate-500">
          Contact and residential details of the student&apos;s parent or guardian.
        </p>
      </div>

      {/* ==================================================
          INFORMATION
      ================================================== */}

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {/* Parent Name */}

        <InfoItem
          icon={<User className="h-4 w-4" />}
          label="Parent Name"
          value={student.parentName}
        />

        {/* Phone */}

        <InfoItem
          icon={<Phone className="h-4 w-4" />}
          label="Phone Number"
          value={student.parentPhone}
        />

        {/* Email */}

        <InfoItem
          icon={<Mail className="h-4 w-4" />}
          label="Email Address"
          value={student.parentEmail}
        />

        {/* Address */}

        <InfoItem
          icon={<MapPin className="h-4 w-4" />}
          label="Residential Address"
          value={student.address}
        />
      </div>

      {/* Bottom spacing */}

      <div className="pb-4" />
    </div>
  );
}
