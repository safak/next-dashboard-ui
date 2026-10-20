"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import { Student } from "@/types/student";
import { exportStudentsToExcel } from "@/lib/exports/exportStudents";

interface StudentExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  students: Student[];
  selectedIds: string[];

  academicYear?: string;
}

type ExportScope = "filtered" | "selected";

export default function StudentExportDialog({
  open,
  onOpenChange,
  students,
  selectedIds,
  academicYear,
}: StudentExportDialogProps) {
  const hasSelection = selectedIds.length > 0;

  const [scope, setScope] = useState<ExportScope>("filtered");

  useEffect(() => {
    if (open) {
      setScope(hasSelection ? "selected" : "filtered");
    }
  }, [open, hasSelection]);

  const studentsToExport = useMemo(() => {
    if (scope === "selected") {
      return students.filter((student) =>
        selectedIds.includes(student.id),
      );
    }

    return students;
  }, [scope, students, selectedIds]);

  const handleExport = async () => {
    await exportStudentsToExcel(
      studentsToExport,
      academicYear,
    );

    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="md"
      title="Export Students"
      description="Choose which student records to export."
      icon={<Download className="h-5 w-5" />}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Export Scope */}

        <section>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Export Scope
          </h3>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50">
              <input
                type="radio"
                checked={scope === "filtered"}
                onChange={() => setScope("filtered")}
                className="mt-1"
              />

              <div>
                <p className="font-medium text-slate-900">
                  Filtered Students
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Export all students currently displayed in the
                  table.
                </p>
              </div>
            </label>

            {hasSelection && (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50">
                <input
                  type="radio"
                  checked={scope === "selected"}
                  onChange={() => setScope("selected")}
                  className="mt-1"
                />

                <div>
                  <p className="font-medium text-slate-900">
                    Selected Students
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Export only the selected students (
                    {selectedIds.length} selected).
                  </p>
                </div>
              </label>
            )}
          </div>
        </section>

        {/* Export Format */}

        <section>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Export Format
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-emerald-600" />

                <div>
                  <p className="font-semibold">
                    Excel Workbook
                  </p>

                  <p className="text-xs text-slate-500">
                    .xlsx
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 opacity-60">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-500" />

                <div>
                  <p className="font-semibold">
                    PDF
                  </p>

                  <p className="text-xs text-slate-500">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Export Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Students
              </span>

              <span className="font-semibold">
                {studentsToExport.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Academic Year
              </span>

              <span className="font-semibold">
                {academicYear ?? "All"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Format
              </span>

              <span className="font-semibold text-emerald-700">
                Excel (.xlsx)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                File Name
              </span>

              <span className="font-medium">
                Student_Register.xlsx
              </span>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}