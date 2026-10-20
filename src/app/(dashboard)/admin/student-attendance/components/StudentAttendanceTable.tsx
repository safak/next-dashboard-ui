"use client";

import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

import type { StudentAttendanceRow } from "@/lib/actions";
import type { AttendanceStatus } from "./types";

interface StudentAttendanceTableProps {
  students: StudentAttendanceRow[];

  attendance: Record<string, AttendanceStatus | undefined>;

  onStatusChange: (studentId: string, status: AttendanceStatus) => void;

  selectedStudentIds: Set<string>;

  allStudentsSelected: boolean;

  someStudentsSelected: boolean;

  onStudentSelect: (studentId: string, selected: boolean) => void;

  onSelectAll: (checked: boolean) => void;

  savingStudentIds: Set<string>;

  hideSelection?: boolean;

  calendarBlocked?: boolean;
}

const formatRollNumber = (rollNo: string | number) => {
  return String(rollNo);
};

export default function StudentAttendanceTable({
  students,
  attendance,
  onStatusChange,
  selectedStudentIds,
  allStudentsSelected,
  someStudentsSelected,
  onStudentSelect,
  onSelectAll,
  savingStudentIds,
  hideSelection = false,
  calendarBlocked = false,
}: StudentAttendanceTableProps) {
  /**
   * Monthly overview:
   *   checkbox + student + roll no + attendance
   *
   * Correction view:
   *   student + roll no + attendance
   */
  const columnCount = hideSelection ? 3 : 4;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table
          className={cn(
            "w-full",
            hideSelection ? "min-w-[650px]" : "min-w-[700px]",
          )}
        >
          {/* =====================================================
              HEADER
          ====================================================== */}

          <thead>
            <tr className="border-b bg-slate-50">
              {/* =================================================
                  SELECT ALL
              ================================================== */}

              {!hideSelection && (
                <th className="w-12 px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={allStudentsSelected}
                    ref={(element) => {
                      if (element) {
                        element.indeterminate = someStudentsSelected;
                      }
                    }}
                    onChange={(event) => {
                      onSelectAll(event.target.checked);
                    }}
                    disabled={students.length === 0}
                    aria-label="Select all students"
                    className="
                      h-4
                      w-4
                      cursor-pointer
                      rounded
                      border-slate-300
                      accent-indigo-600
                      focus:ring-2
                      focus:ring-indigo-500
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  />
                </th>
              )}

              {/* =================================================
                  STUDENT
              ================================================== */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Student
              </th>

              {/* =================================================
                  ROLL NUMBER
              ================================================== */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Roll No
              </th>

              {/* =================================================
                  ATTENDANCE
              ================================================== */}

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                Attendance
              </th>
            </tr>
          </thead>

          {/* =====================================================
              BODY
          ====================================================== */}

          <tbody>
            {students.map((student) => {
              const status = attendance[student.id];

              const isSelected = selectedStudentIds.has(student.id);

              const isSaving = savingStudentIds.has(student.id);

              return (
                <tr
                  key={student.id}
                  className={cn(
                    "border-b transition-colors last:border-0",
                    isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50",
                  )}
                >
                  {/* STUDENT CHECKBOX */}

                  {!hideSelection && (
                    <td className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(event) => {
                          onStudentSelect(student.id, event.target.checked);
                        }}
                        disabled={isSaving || calendarBlocked}
                        aria-label={`Select ${student.name} ${student.surname}`}
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          rounded
                          border-slate-300
                          accent-indigo-600
                          focus:ring-2
                          focus:ring-indigo-500
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      />
                    </td>
                  )}

                  {/* STUDENT */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          isSelected ? "bg-indigo-100" : "bg-blue-50",
                        )}
                      >
                        <UserRound
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "text-indigo-600" : "text-blue-600",
                          )}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {student.name} {student.surname}
                        </p>

                        <p className="text-xs text-slate-500">Student</p>
                      </div>
                    </div>
                  </td>

                  {/* ROLL NUMBER */}

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
                      {formatRollNumber(student.rollNo)}
                    </span>
                  </td>

                  {/* ATTENDANCE */}

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* PRESENT */}

                      <button
                        type="button"
                        onClick={() => onStatusChange(student.id, "PRESENT")}
                        disabled={isSaving || calendarBlocked}
                        aria-label={`Mark ${student.name} present`}
                        title="Present"
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-all",

                          status === "PRESENT"
                            ? "border-green-600 bg-green-600 text-white shadow-sm"
                            : "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100",

                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                      >
                        P
                      </button>

                      {/* ABSENT */}

                      <button
                        type="button"
                        onClick={() => onStatusChange(student.id, "ABSENT")}
                        disabled={isSaving || calendarBlocked}
                        aria-label={`Mark ${student.name} absent`}
                        title="Absent"
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-all",

                          status === "ABSENT"
                            ? "border-red-600 bg-red-600 text-white shadow-sm"
                            : "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",

                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                      >
                        A
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* EMPTY STATE */}

            {students.length === 0 && (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
