"use client";

import Image from "next/image";
import { BadgeCheck, GraduationCap, Hash } from "lucide-react";

import type { Student } from "@/types/student";

interface ProfileHeaderProps {
  student: Student;
}

export default function ProfileHeader({ student }: ProfileHeaderProps) {
  const isActive = student.status === "ACTIVE";

  return (
    <div className="border-b border-slate-200 bg-white px-3 py-3">
      <div className="flex items-center gap-4">
        {/* STUDENT AVATAR */}

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          {student.image ? (
            <Image
              src={student.image}
              alt={student.fullName}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-lg font-bold text-indigo-600">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* STUDENT INFORMATION */}

        <div className="min-w-0 flex-1">
          {/* Name */}

          <h2 className="truncate text-base font-bold text-slate-900">
            {student.fullName}
          </h2>

          {/* Admission + Roll */}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-slate-400" />

              <span>{student.admissionNo}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />

              <span>Roll No. {student.rollNo}</span>
            </div>
          </div>

          {/* ==================================================
              BADGES
          ================================================== */}

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {/* Class */}

            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-indigo-50
                px-2.5
                py-1
                text-[11px]
                font-semibold
                text-indigo-700
                ring-1
                ring-inset
                ring-indigo-100
              "
            >
              {student.className}
            </span>

            {/* Academic Year */}

            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[11px]
                font-semibold
                text-slate-600
                ring-1
                ring-inset
                ring-slate-200
              "
            >
              {student.academicYear}
            </span>

            {/* Status */}

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
  );
}
