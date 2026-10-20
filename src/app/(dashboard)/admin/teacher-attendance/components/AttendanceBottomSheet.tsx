"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Save, X } from "lucide-react";
import { createPortal } from "react-dom";

import StatusBadge from "@/components/admin/StatusBadge";
import { ATTENDANCE_STATUSES } from "@/lib/constants/attendance";

interface TeacherAttendance {
  teacherId: string;
  attendanceId: number | null;

  name: string;
  surname: string;

  email: string | null;
  phone: string | null;

  img: string | null;

  status: string | null;

  remarks: string;

  markedAt: string | null;

  isMarked: boolean;
}

interface Props {
  open: boolean;
  teacher: TeacherAttendance | null;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}

function formatDate(value: string) {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function isSunday(value: string) {
  if (!value) return false;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return false;
  }

  return new Date(year, month - 1, day).getDay() === 0;
}

export default function AttendanceBottomSheet({
  open,
  teacher,
  date,
  onClose,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState("PRESENT");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [calendarBlockReason, setCalendarBlockReason] = useState<string | null>(
    null,
  );
  const [calendarStatusLoading, setCalendarStatusLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!teacher) return;

    setStatus(
      teacher.status && teacher.status !== "NOT_MARKED"
        ? teacher.status
        : "PRESENT",
    );

    setRemarks(teacher.remarks ?? "");
    setError("");
  }, [teacher]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !date) return;

    let cancelled = false;

    async function checkCalendarStatus() {
      setCalendarStatusLoading(true);
      setCalendarBlocked(false);
      setCalendarBlockReason(null);

      try {
        const response = await fetch(
          `/api/attendance/calendar-status?date=${encodeURIComponent(date)}`,
          { cache: "no-store" },
        );

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setCalendarBlocked(true);
          setCalendarBlockReason(
            result.error ?? "Unable to verify the school calendar.",
          );
        } else {
          setCalendarBlocked(Boolean(result.blocked));
          setCalendarBlockReason(result.reason ?? null);
        }
      } catch {
        if (cancelled) return;

        setCalendarBlocked(true);
        setCalendarBlockReason(
          "Unable to verify the school calendar. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setCalendarStatusLoading(false);
        }
      }
    }

    void checkCalendarStatus();

    return () => {
      cancelled = true;
    };
  }, [open, date]);

  if (!mounted || !open || !teacher) {
    return null;
  }

  const currentTeacher = teacher;
  const attendanceDisabled = calendarStatusLoading || calendarBlocked;

  async function handleSave() {
    if (attendanceDisabled) {
      setError("Attendance cannot be marked at this time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/admin/teachers/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: currentTeacher.teacherId,
          attendanceId: currentTeacher.attendanceId,
          status,
          remarks: remarks.trim(),
          date,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save attendance.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save attendance:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save attendance. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[3px]"
        onClick={saving ? undefined : onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Mark Attendance
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Record teacher attendance for the selected date
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-700">
                  {currentTeacher.name} {currentTeacher.surname}
                </p>

                <StatusBadge status={currentTeacher.status ?? "NOT_MARKED"} />

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(date)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            {attendanceDisabled && (
              <div
                role="alert"
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-amber-800">
                  {calendarStatusLoading
                    ? "Checking School Calendar"
                    : "Attendance Disabled"}
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  {calendarStatusLoading
                    ? "Please wait while the school calendar is checked."
                    : (calendarBlockReason ??
                      "Unable to verify the school calendar. Attendance is disabled for safety.")}
                </p>
              </div>
            )}

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Attendance Status
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ATTENDANCE_STATUSES.map((item) => {
                  const Icon = item.icon;
                  const active = status === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={saving || attendanceDisabled}
                      onClick={() => setStatus(item.value)}
                      className={`rounded-xl border px-3 py-3 transition-all duration-200 ${
                        active
                          ? `${item.border} ${item.bg} shadow-sm ring-2 ring-violet-100`
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      } ${attendanceDisabled ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            active ? item.bg : "bg-slate-50"
                          }`}
                        >
                          <Icon size={20} className={item.color} />
                        </div>

                        <span
                          className={`text-sm font-medium ${
                            active ? "text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Remarks
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                rows={3}
                value={remarks}
                disabled={saving || attendanceDisabled}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter remarks..."
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || attendanceDisabled}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : attendanceDisabled
                  ? "Attendance Disabled"
                  : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
