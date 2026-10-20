"use client";

import {
  Check,
  X,
  Users,
  XCircle,
} from "lucide-react";

interface StudentAttendanceBulkActionsProps {
  selectedCount: number;

  onMarkPresent: () => void;

  onMarkAbsent: () => void;

  onClearSelection: () => void;

  disabled?: boolean;
}

export default function StudentAttendanceBulkActions({
  selectedCount,
  onMarkPresent,
  onMarkAbsent,
  onClearSelection,
  disabled = false,
}: StudentAttendanceBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* ================= SELECTED INFO ================= */}

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
            <Users className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {selectedCount}{" "}
              {selectedCount === 1 ? "Student" : "Students"} Selected
            </p>

            <p className="text-xs text-slate-500">
              Choose an attendance action for the selected students.
            </p>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="flex flex-wrap items-center gap-2">
          {/* MARK PRESENT */}

          <button
            type="button"
            onClick={onMarkPresent}
            disabled={disabled}
            className="
              inline-flex
              h-9
              items-center
              gap-2
              rounded-lg
              border
              border-emerald-200
              bg-white
              px-3
              text-sm
              font-medium
              text-emerald-700
              shadow-sm
              transition-colors
              hover:bg-emerald-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Check className="h-4 w-4" />
            Mark Present
          </button>

          {/* MARK ABSENT */}

          <button
            type="button"
            onClick={onMarkAbsent}
            disabled={disabled}
            className="
              inline-flex
              h-9
              items-center
              gap-2
              rounded-lg
              border
              border-rose-200
              bg-white
              px-3
              text-sm
              font-medium
              text-rose-700
              shadow-sm
              transition-colors
              hover:bg-rose-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="h-4 w-4" />
            Mark Absent
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={onClearSelection}
            disabled={disabled}
            className="
              inline-flex
              h-9
              items-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              font-medium
              text-slate-600
              shadow-sm
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <XCircle className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}