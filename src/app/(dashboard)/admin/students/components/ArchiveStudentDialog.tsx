"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";

import type { Student } from "@/types/student";

interface ArchiveStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export default function ArchiveStudentDialog({
  open,
  onOpenChange,
  student,
}: ArchiveStudentDialogProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  if (!open || !student) return null;

  const handleArchive = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/students/${student.id}/archive`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success("Student archived successfully.");

      router.refresh();

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to archive student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-5">
          <div className="rounded-xl bg-orange-100 p-3">
            <Archive className="h-6 w-6 text-orange-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Archive Student
            </h2>

            <p className="text-sm text-slate-500">
              Move student to archived records
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 text-orange-600" />

              <div>
                <p className="font-medium text-slate-900">
                  {student.fullName}
                </p>

                <p className="text-sm text-slate-600">
                  Admission No: {student.admissionNo}
                </p>

                <p className="mt-3 text-sm text-slate-600">
                  This student will no longer appear in the
                  active students list.
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Attendance, fee records, academic history
                  and reports will be preserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleArchive}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Archive Student
          </button>
        </div>
      </div>
    </div>
  );
}