"use client";

import {
  Archive,
  RotateCcw,
  Trash2,
  Download,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface StudentBulkToolbarProps {
  count: number;

  archived?: boolean;

  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onClear: () => void;
}

export default function StudentBulkToolbar({
  count,
  archived = false,

  onArchive,
  onRestore,
  onDelete,
  onExport,
  onClear,
}: StudentBulkToolbarProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-indigo-50 p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            {count}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {count} {count === 1 ? "Student" : "Students"} Selected
            </h3>

            <p className="text-sm text-slate-500">
              Choose an action to perform on the selected students.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          {!archived ? (
            <Button
              onClick={onArchive}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          ) : (
            <>
              <Button
                onClick={onRestore}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </Button>

              <Button
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            variant="ghost"
            onClick={onClear}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}