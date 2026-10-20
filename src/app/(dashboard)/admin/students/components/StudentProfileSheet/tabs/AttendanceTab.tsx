"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarDays, Loader2, RefreshCw } from "lucide-react";

import AttendanceSummaryCards from "../components/AttendanceSummaryCards";
import AttendanceProgress from "../components/AttendanceProgress";
import MonthlyAttendance from "../components/MonthlyAttendance";
import RecentAttendance from "../components/RecentAttendance";
import AttendanceQuickActions from "../components/AttendanceQuickActions";

import type { Student } from "@/types/student";

interface AttendanceSummary {
  attendancePercentage: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  workingDays: number;
}

interface MonthlyAttendanceItem {
  month: string;
  percentage: number;
}

interface AttendanceRecord {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
}

interface AttendanceResponse {
  success: boolean;
  summary: AttendanceSummary;
  monthly: MonthlyAttendanceItem[];
  recentAttendance: AttendanceRecord[];
}

interface AttendanceTabProps {
  student: Student;
}

export default function AttendanceTab({ student }: AttendanceTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<AttendanceResponse | null>(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/students/${student.id}/attendance`,
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to load attendance.");
      }

      setData(result);
    } catch (error) {
      console.error("Failed to load attendance:", error);
      setError("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  if (loading) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading attendance...
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Please wait while attendance is loaded.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/60 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-red-700">
          Unable to Load Attendance
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-red-600">
          {error || "Something went wrong while loading attendance."}
        </p>

        <button
          type="button"
          onClick={fetchAttendance}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
      </div>
    );
  }

  if (data.summary.workingDays === 0) {
    return (
      <div className="space-y-4 pb-4">
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-slate-800">
            No Attendance Records
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Attendance has not been recorded for this student yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <AttendanceSummaryCards summary={data.summary} />

      <AttendanceProgress
        attendancePercentage={data.summary.attendancePercentage}
        presentDays={data.summary.presentDays}
        absentDays={data.summary.absentDays}
        workingDays={data.summary.workingDays}
      />

      <MonthlyAttendance monthly={data.monthly} />

      <RecentAttendance records={data.recentAttendance} />

      {/* <AttendanceQuickActions studentId={student.id} /> */}
    </div>
  );
}
