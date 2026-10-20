"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  CalendarDays,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  User,
} from "lucide-react";

import StatusBadge from "@/components/admin/StatusBadge";

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
  onReject: () => void;
  onSuccess: () => void;
}

export default function LeaveBottomSheet({
  open,
  leave,
  onClose,
  onReject,
  onSuccess,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setError("");
      setApproving(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !approving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, approving, onClose]);

  if (!mounted || !open || !leave) return null;

  function formatLabel(value: string) {
    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function approveLeave() {
    if (!leave || approving) return;

    setApproving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/teachers/leaves/approve/${leave.id}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.error || "Failed to approve leave request.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Approve leave error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to approve leave request.",
      );
    } finally {
      setApproving(false);
    }
  }

  const formattedDate = new Date(leave.leaveDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-[#303552]/45
          backdrop-blur-[3px]
        "
        onClick={() => {
          if (!approving) {
            onClose();
          }
        }}
      />

      {/* Modal */}

      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        <div
          className="
            relative
            flex
            w-full
            max-w-[580px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-slate-200/80
            bg-white
            shadow-[0_25px_70px_rgba(48,53,82,0.20)]
          "
          onClick={(event) => event.stopPropagation()}
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF]">
                  <CalendarDays className="h-4 w-4 text-[#4B517D]" />
                </div>

                <h2 className="text-base font-bold text-[#303552]">
                  Leave Details
                </h2>
              </div>

              <p className="mt-1 pl-10 text-[10px] text-slate-400">
                Review teacher leave request
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={approving}
              aria-label="Close leave details"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition-all
                hover:bg-slate-100
                hover:text-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}

          <div className="max-h-[calc(100vh-190px)] overflow-y-auto p-5">
            <div className="space-y-3.5">
              {/* Teacher */}

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEF2FF]">
                  {leave.teacherImage ? (
                    <Image
                      src={leave.teacherImage}
                      alt={leave.teacherName || "Teacher"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-[#4B517D]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-[#303552]">
                      {leave.teacherName}
                    </h3>

                    <StatusBadge status={leave.status} />
                  </div>

                  <p className="mt-1 truncate text-[10px] text-slate-400">
                    {leave.phone || leave.email || "No contact information"}
                  </p>
                </div>
              </div>

              {/* Leave Type + Duration */}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    Leave Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#303552]">
                    {formatLabel(leave.leaveType)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#303552]">
                    {formatLabel(leave.duration)}
                  </p>
                </div>
              </div>

              {/* Date */}

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF8EC]">
                  <CalendarDays className="h-4 w-4 text-[#F59A23]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    Leave Date
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#303552]">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Reason */}

              <div className="rounded-xl border border-slate-100 bg-[#F8F9FC] px-3.5 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <FileText className="h-3.5 w-3.5 text-[#4B517D]" />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#303552]">
                    Reason
                  </p>
                </div>

                <p className="text-xs leading-5 text-slate-600">
                  {leave.reason || "No reason provided"}
                </p>
              </div>

              {/* Rejection Reason */}

              {leave.status === "REJECTED" && leave.rejectionReason && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />

                    <p className="text-xs font-bold text-red-700">
                      Rejection Reason
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-red-600">
                    {leave.rejectionReason}
                  </p>
                </div>
              )}

              {/* Approval Information */}

              {leave.status === "APPROVED" && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                  <div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Leave Approved
                    </p>

                    {leave.approvedAt && (
                      <p className="mt-0.5 text-[10px] text-emerald-600">
                        {new Date(leave.approvedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Error */}

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3">
                  <XCircle className="h-4 w-4 shrink-0 text-red-500" />

                  <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              disabled={approving}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-xs
                font-semibold
                text-slate-600
                transition-colors
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Close
            </button>

            {leave.status === "PENDING" && (
              <>
                <button
                  type="button"
                  onClick={onReject}
                  disabled={approving}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-red-50
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-red-600
                    transition-colors
                    hover:bg-red-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>

                <button
                  type="button"
                  onClick={approveLeave}
                  disabled={approving}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-[#4B517D]
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-[#3F456C]
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {approving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
