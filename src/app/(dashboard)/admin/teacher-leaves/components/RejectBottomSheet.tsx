"use client";

import { useState, useEffect } from "react";
import { X, FileText, XCircle } from "lucide-react";

interface Leave {
  id: number;

  teacherId: string;

  teacherName: string;

  teacherImage: string | null;

  phone: string | null;

  email: string | null;

  leaveDate: string;

  leaveType: string;

  duration: string;

  reason: string;

  status: string;

  approvedBy: string | null;

  approvedAt: string | null;

  rejectionReason: string | null;
}

interface Props {
  open: boolean;
  leave: Leave | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RejectBottomSheet({
  open,
  leave,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  if (!open || !leave) return null;

  async function rejectLeave() {
    if (!leave) return;

    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/teachers/leaves/reject/${leave.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejectionReason: reason.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject leave.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Overlay */}

      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Bottom Sheet */}

      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl">
        {/* Handle */}

        <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-slate-300" />

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-red-600">Reject Leave</h2>

            <p className="text-sm text-slate-500">{leave.teacherName}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-6 p-6">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="font-medium text-yellow-800">Leave Request</p>

            <p className="mt-2 text-sm text-yellow-700">
              {leave.leaveType.replaceAll("_", " ")} •{" "}
              {new Date(leave.leaveDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <FileText size={18} />
              Rejection Reason
            </label>

            <textarea
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                p-4
                outline-none
                transition
                focus:border-red-500
                focus:ring-2
                focus:ring-red-100
              "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="
                rounded-xl
                border
                border-slate-300
                py-3
                font-medium
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              onClick={rejectLeave}
              disabled={saving}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-600
                py-3
                font-medium
                text-white
                transition
                hover:bg-red-700
                disabled:opacity-50
              "
            >
              <XCircle size={18} />

              {saving ? "Rejecting..." : "Reject Leave"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
