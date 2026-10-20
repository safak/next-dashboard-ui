"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Phone, Mail } from "lucide-react";

import StudentRowActions from "./StudentRowActions";

import { Student } from "@/types/student";
import { Checkbox } from "@/components/ui/Checkbox";

interface StudentTableProps {
  students: Student[];

  archived?: boolean;

  selectedIds: string[];

  onSelect: (studentId: string, checked: boolean) => void;

  onSelectAll: (checked: boolean) => void;

  onView: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onArchive?: (student: Student) => void;
  onRestore?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export default function StudentTable({
  students,
  archived = false,

  selectedIds,
  onSelect,
  onSelectAll,

  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: StudentTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /*
   * Always start the table at the left-most position
   * when the displayed student list changes.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [students]);

  /*
   * Empty state is handled by EmptyStudents.
   * Keep this component responsible only for rendering
   * the student table.
   */
  if (students.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div ref={scrollRef} className="hide-scrollbar overflow-x-auto">
        <table className="min-w-[1660px] w-full border-separate border-spacing-0">
          {/* ==================================================
              HEADER
          ================================================== */}

          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {/* Checkbox */}

              <th
                className="
                  sticky
                  left-0
                  z-40
                  w-12
                  min-w-12
                  max-w-12
                  border-b
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-3
                "
              >
                <Checkbox
                  checked={
                    selectedIds.length === 0
                      ? false
                      : selectedIds.length === students.length
                        ? true
                        : "indeterminate"
                  }
                  onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                />
              </th>

              {/* Student Name */}

              <th
                className="
                  sticky
                  left-12
                  z-40
                  w-[240px]
                  min-w-[240px]
                  max-w-[240px]
                  border-b
                  border-r
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-left
                "
              >
                Student Name
              </th>

              {/* Admission */}

              <th className="w-44 min-w-44 border-b border-slate-200 px-4 py-3">
                Admission No
              </th>

              {/* Roll */}

              <th className="w-36 min-w-36 border-b border-slate-200 px-4 py-3">
                Roll No
              </th>

              {/* Class */}

              <th className="w-32 min-w-32 border-b border-slate-200 px-4 py-3">
                Class
              </th>

              {/* Academic Year */}

              <th className="w-40 min-w-40 border-b border-slate-200 px-4 py-3">
                Academic Year
              </th>

              {/* Parent */}

              <th className="w-[220px] min-w-[220px] border-b border-slate-200 px-4 py-3">
                Parent
              </th>

              {/* Phone */}

              <th className="w-40 min-w-40 border-b border-slate-200 px-4 py-3">
                Phone
              </th>

              {/* Email */}

              <th className="w-[260px] min-w-[260px] border-b border-slate-200 px-4 py-3">
                Email
              </th>

              {/* Status */}

              <th className="w-32 min-w-32 border-b border-slate-200 px-4 py-3">
                Status
              </th>

              {/* Actions */}

              <th
                className="
                  w-20
                  min-w-20
                  border-b
                  border-slate-200
                  px-3
                  py-3
                  text-center
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* ==================================================
              BODY
          ================================================== */}

          <tbody className="text-sm">
            {students.map((student) => {
              const isSelected = selectedIds.includes(student.id);

              return (
                <tr
                  key={student.id}
                  className={`
                    group
                    transition-colors
                    hover:bg-slate-50
                    ${isSelected ? "bg-indigo-50/60" : ""}
                  `}
                >
                  {/* ==================================================
                      CHECKBOX
                  ================================================== */}

                  <td
                    className={`
                      sticky
                      left-0
                      z-30
                      w-12
                      min-w-12
                      max-w-12
                      border-b
                      border-slate-100
                      px-3
                      py-3
                      ${
                        isSelected
                          ? "bg-indigo-50/60"
                          : "bg-white group-hover:bg-slate-50"
                      }
                    `}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onSelect(student.id, Boolean(checked))
                      }
                    />
                  </td>

                  {/* ==================================================
                      STUDENT
                  ================================================== */}

                  <td
                    className={`
                      sticky
                      left-12
                      z-30
                      w-[240px]
                      min-w-[240px]
                      max-w-[240px]
                      border-b
                      border-r
                      border-slate-200
                      px-4
                      py-2.5
                      ${
                        isSelected
                          ? "bg-indigo-50/60"
                          : "bg-white group-hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        {student.image ? (
                          <Image
                            src={student.image}
                            alt={student.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-sm font-semibold text-indigo-600">
                            {student.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {student.fullName}
                        </p>

                        <p className="text-xs text-slate-400">Student</p>
                      </div>
                    </div>
                  </td>

                  {/* ==================================================
                      ADMISSION NO
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                    {student.admissionNo}
                  </td>

                  {/* ==================================================
                      ROLL NO
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                    {student.rollNo}
                  </td>

                  {/* ==================================================
                      CLASS
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-700">
                    {student.className}
                  </td>

                  {/* ==================================================
                      ACADEMIC YEAR
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                    {student.academicYear}
                  </td>

                  {/* ==================================================
                      PARENT
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3">
                    <span className="truncate font-medium text-slate-700">
                      {student.parentName}
                    </span>
                  </td>

                  {/* ==================================================
                      PHONE
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                      <span>{student.parentPhone ?? "-"}</span>
                    </div>
                  </td>

                  {/* ==================================================
                      EMAIL
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2 text-slate-600">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                      <span className="truncate">
                        {student.parentEmail ?? "-"}
                      </span>
                    </div>
                  </td>

                  {/* ==================================================
                      STATUS
                  ================================================== */}

                  <td className="border-b border-slate-100 px-4 py-3">
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
                        ${
                          student.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${
                            student.status === "ACTIVE"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }
                        `}
                      />

                      {student.status}
                    </span>
                  </td>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <td
                    className="
                      border-b
                      border-slate-100
                      px-3
                      py-2.5
                      text-center
                      align-middle
                    "
                  >
                    <div className="flex items-center justify-center">
                      <StudentRowActions
                        student={student}
                        archived={archived}
                        onView={onView}
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onRestore={onRestore}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
