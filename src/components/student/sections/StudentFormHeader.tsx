"use client";

import { GraduationCap } from "lucide-react";

import ModalCloseButton from "@/components/ui/ModalCloseButton";

interface StudentFormHeaderProps {
  type: "create" | "update";
  onClose: () => void;
  academicYear?: string;
  rollNumber?: string;
}

export default function StudentFormHeader({
  type,
  onClose,
  academicYear,
  rollNumber,
}: StudentFormHeaderProps) {
  return (
    <div className="relative shrink-0 border-b border-slate-200 bg-white">
      <ModalCloseButton onClose={onClose} />

      <div className="px-6 pt-4 pb-3">
        {/* ================= Title ================= */}

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50">
            <GraduationCap className="h-4 w-4 text-sky-700" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-[20px] font-bold tracking-tight text-slate-900">
              {type === "create" ? "Create Student" : "Update Student"}
            </h1>

            <p className="max-w-2xl text-xs leading-6 text-slate-500">
              Add and manage student personal, academic and admission
              information.
            </p>
          </div>
        </div>

        {/* ================= Divider ================= */}

        <div className="mt-2 mb-1.5 h-px bg-slate-200" />

        {/* ================= Meta Information ================= */}

        <div className="grid grid-cols-3 divide-x divide-slate-200">
          {/* Academic Year */}

          <div className="flex min-h-[60px] flex-col justify-center px-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Academic Year
            </span>

            <span className="mt-1 text-sm font-semibold text-slate-900">
              {academicYear ?? "Academic Year"}
            </span>
          </div>

          {/* Roll Number */}

          <div className="flex min-h-[60px] flex-col justify-center px-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Roll Number
            </span>

            <span className="mt-1 text-sm font-semibold text-slate-900">
              {rollNumber ?? "Auto Generated"}
            </span>
          </div>

          {/* Status */}

          <div className="flex min-h-[60px] flex-col justify-center px-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Status
            </span>

            <div className="mt-1">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                  type === "create"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {type === "create" ? "New Admission" : "Editing Record"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
