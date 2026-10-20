"use client";

import { FileClock, RotateCcw, Trash2 } from "lucide-react";

interface DraftResumeDialogProps {
  open: boolean;
  studentName: string;
  stepName: string;
  savedAt: number;

  onResume: () => void;
  onStartNew: () => void;
}

export default function DraftResumeDialog({
  open,
  studentName,
  stepName,
  savedAt,
  onResume,
  onStartNew,
}: DraftResumeDialogProps) {
  if (!open) return null;

  const date = new Date(savedAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-100 p-3">
              <FileClock className="h-6 w-6 text-sky-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Resume Previous Admission
              </h2>

              <p className="text-sm text-slate-500">
                We found an unfinished admission draft.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Info label="Student" value={studentName || "Unnamed Student"} />
          <Info label="Last Step" value={stepName} />
          <Info label="Saved At" value={date.toLocaleString()} />
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onStartNew}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Start New
          </button>

          <button
            onClick={onResume}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
          >
            <RotateCcw className="h-4 w-4" />
            Resume Draft
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}