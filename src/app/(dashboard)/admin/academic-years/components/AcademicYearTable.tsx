"use client";

import { CalendarDays, GraduationCap, Users } from "lucide-react";

import AcademicYearRowActions from "./AcademicYearRowActions";

interface AcademicYear {
  id: number;
  label: string;
  isActive: boolean;

  _count: {
    classes: number;
    students: number;
  };
}

interface AcademicYearTableProps {
  academicYears: AcademicYear[];

  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onActivate?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function AcademicYearTable({
  academicYears,
  onView,
  onEdit,
  onActivate,
  onDelete,
}: AcademicYearTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {/* Academic Year */}
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Academic Year
                </span>
              </th>

              {/* Status */}
              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </span>
              </th>

              {/* Classes */}
              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Classes
                </span>
              </th>

              {/* Students */}
              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </span>
              </th>

              {/* Actions */}
              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {academicYears.map((year) => (
              <tr
                key={year.id}
                className="group border-b border-slate-100 last:border-b-0 transition-colors
                  duration-150 hover:bg-indigo-50/30
                "
              >
                {/* Academic Year */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="
                        flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50
                        text-indigo-600 transition-transform duration-150 group-hover:scale-105
                      "
                    >
                      <CalendarDays className="h-[18px] w-[18px]" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                        {year.label}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Status */}

                <td className="px-5 py-2.5 text-center">
                  {year.isActive ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50
                        px-2.5 py-1 text-xs font-semibold text-emerald-700
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100
                        px-2.5 py-1 text-xs font-semibold text-slate-600
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Inactive
                    </span>
                  )}
                </td>

                {/* Classes */}

                <td className="px-5 py-2.5 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md
                     bg-purple-50 text-purple-600"
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {year._count.classes}
                    </span>
                  </div>
                </td>

                {/* Students */}

                <td className="px-5 py-2.5 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                      <Users className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {year._count.students}
                    </span>
                  </div>
                </td>

                {/* Actions */}

                <td className="px-5 py-2.5 text-center">
                  <div className="flex justify-center">
                    <AcademicYearRowActions
                      academicYear={year}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onActivate={onActivate}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty Table State */}

            {academicYears.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <CalendarDays className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No academic years found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no academic year records to display.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
