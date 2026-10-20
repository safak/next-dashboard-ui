"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { ClipboardCheck, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import AttendanceCorrectionDatePicker from "./AttendanceCorrectionDatePicker";
import {
  getStudentAttendance,
  getMonthlyStudentAttendance,
  saveStudentAttendance,
  type StudentAttendanceRow,
} from "@/lib/actions";
import TablePagination from "@/components/ui/TablePagination";
import StudentAttendanceTable from "./StudentAttendanceTable";
import useStudentAttendanceSelection from "./useStudentAttendanceSelection";
import StudentAttendanceDailySummary from "./StudentAttendanceDailySummary";
import MonthlyAttendanceHistory from "./MonthlyAttendanceHistory";
import MonthlyAttendanceSummary from "./MonthlyAttendanceSummary";
import "react-datepicker/dist/react-datepicker.css";
import "./student-attendance-datepicker.css";
import AttendanceReportActions from "./AttendanceReportActions";
import type {
  AttendanceStatus,
  AttendanceViewMode,
  ClassOption,
  MonthlyAttendanceData,
} from "./types";

import { getCurrentMonth, getTodayDate, parseDate } from "./utils";

import { DEFAULT_ATTENDANCE_VIEW, DEFAULT_CLASS_NAME } from "./constants";

import AttendanceHeader from "./AttendanceHeader";

interface StudentAttendanceDashboardProps {
  classes: ClassOption[];
}

export default function StudentAttendanceDashboard({
  classes,
}: StudentAttendanceDashboardProps) {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [viewMode, setViewMode] = useState<AttendanceViewMode>(
    DEFAULT_ATTENDANCE_VIEW,
  );

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [correctionDate, setCorrectionDate] = useState(getTodayDate());

  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [calendarBlockReason, setCalendarBlockReason] = useState<string | null>(
    null,
  );
  const [calendarStatusLoading, setCalendarStatusLoading] = useState(true);

  const [correctionStudentId, setCorrectionStudentId] = useState<string | null>(
    null,
  );

  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceData | null>(
    null,
  );

  const correctionStudent = useMemo(() => {
    if (!monthlyData || !correctionStudentId) {
      return null;
    }

    return (
      monthlyData.students.find(
        (student) => student.id === correctionStudentId,
      ) ?? null
    );
  }, [monthlyData, correctionStudentId]);

  const [students, setStudents] = useState<StudentAttendanceRow[]>([]);

  const [correctionDailyStudent, setCorrectionDailyStudent] =
    useState<StudentAttendanceRow | null>(null);

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus | undefined>
  >({});

  const correctionSummary = useMemo(() => {
    if (!correctionStudent || !monthlyData) {
      return null;
    }

    let present = correctionStudent.present;
    let absent = correctionStudent.absent;

    const originalStatus = correctionDailyStudent?.attendance?.status as
      | AttendanceStatus
      | undefined;

    const currentStatus =
      correctionStudentId !== null
        ? attendance[correctionStudentId]
        : undefined;

    if (originalStatus === "PRESENT") {
      present -= 1;
    }

    if (originalStatus === "ABSENT") {
      absent -= 1;
    }

    if (currentStatus === "PRESENT") {
      present += 1;
    }

    if (currentStatus === "ABSENT") {
      absent += 1;
    }

    present = Math.max(0, present);
    absent = Math.max(0, absent);

    const workingDays = monthlyData.workingDays;

    const marked = Math.min(present + absent, workingDays);

    if (present + absent > workingDays) {
      const total = present + absent;

      present = Math.round((present / total) * workingDays);
      absent = workingDays - present;
    }

    const pending = Math.max(0, workingDays - present - absent);

    const attendancePercentage =
      present + absent > 0
        ? Number(((present / (present + absent)) * 100).toFixed(2))
        : 0;

    return {
      workingDays,
      present,
      absent,
      pending,
      attendancePercentage,
    };
  }, [
    correctionStudent,
    correctionStudentId,
    correctionDailyStudent,
    attendance,
    monthlyData,
  ]);

  const [loading, setLoading] = useState(false);

  const [savingStudentIds, setSavingStudentIds] = useState<Set<string>>(
    new Set(),
  );

  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null,
  );

  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(10);

  /* VIEW STATE */

  const isMonthlyView = viewMode === "MONTH";

  const isCorrectionView = viewMode === "CORRECTION";

  /* STUDENT SELECTION */

  const {
    selectedStudentIds,
    selectedCount,
    allStudentsSelected,
    someStudentsSelected,
    handleStudentSelect,
    handleSelectAllStudents,
    clearSelection,
  } = useStudentAttendanceSelection(students);

  /* DERIVED SAVING STATE */

  const saving = savingStudentIds.size > 0;

  /* ============================================================
     CLASS OPTIONS
  ============================================================ */

  const classOptions = useMemo(
    () =>
      classes.map((item) => ({
        value: String(item.id),
        label: `${item.name} — ${item.academicYear.label}`,
      })),
    [classes],
  );

  /* ============================================================
     SELECTED CLASS
  ============================================================ */

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId),
    [classes, selectedClassId],
  );

  /* ============================================================
     DEFAULT CLASS
  ============================================================ */

  /**
   * Automatically select Nursery.
   *
   * If Nursery does not exist,
   * select the first available class.
   */
  useEffect(() => {
    if (selectedClassId !== null || classes.length === 0) {
      return;
    }

    const nursery = classes.find(
      (item) =>
        item.name.trim().toLowerCase() === DEFAULT_CLASS_NAME.toLowerCase(),
    );

    if (nursery) {
      setSelectedClassId(nursery.id);
      return;
    }

    setSelectedClassId(classes[0].id);
  }, [classes, selectedClassId]);

  /* BUILD DAILY ATTENDANCE STATE */

  const buildAttendanceState = useCallback((rows: StudentAttendanceRow[]) => {
    const next: Record<string, AttendanceStatus> = {};

    rows.forEach((student) => {
      const status = student.attendance?.status;

      if (status === "PRESENT") {
        next[student.id] = "PRESENT";
      }

      if (status === "ABSENT") {
        next[student.id] = "ABSENT";
      }
    });

    return next;
  }, []);

  useEffect(() => {
    if (isMonthlyView) {
      return;
    }

    if (!selectedClassId || !selectedDate) {
      setStudents([]);
      setAttendance({});
      clearSelection();

      return;
    }

    clearSelection();

    let cancelled = false;

    const loadAttendance = async () => {
      try {
        setLoading(true);

        const result = await getStudentAttendance(
          selectedClassId,
          parseDate(selectedDate),
        );

        if (cancelled) {
          return;
        }

        if (!result.success) {
          toast.error(result.error ?? "Failed to load student attendance.");

          setStudents([]);
          setAttendance({});

          return;
        }

        const loadedStudents = result.data ?? [];

        setStudents(loadedStudents);

        setAttendance(buildAttendanceState(loadedStudents));

        if (isCorrectionView && correctionStudentId) {
          const selectedStudent =
            loadedStudents.find(
              (student) => student.id === correctionStudentId,
            ) ?? null;

          setCorrectionDailyStudent(selectedStudent);
        }
      } catch (error) {
        console.error("Failed to load student attendance:", error);

        if (!cancelled) {
          toast.error("Failed to load student attendance.");

          setStudents([]);
          setAttendance({});
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [
    selectedClassId,
    selectedDate,
    isMonthlyView,
    isCorrectionView,
    correctionStudentId,
    clearSelection,
    buildAttendanceState,
  ]);

  useEffect(() => {
    if (!isMonthlyView || !selectedClassId || !selectedMonth) {
      return;
    }

    let cancelled = false;

    const loadMonthlyAttendance = async () => {
      try {
        setLoading(true);

        // Clear previous class/month data immediately
        setMonthlyData(null);

        const result = await getMonthlyStudentAttendance(
          selectedClassId,
          selectedMonth,
        );

        if (cancelled) {
          return;
        }

        if (!result.success) {
          toast.error(result.error ?? "Failed to load monthly attendance.");

          setMonthlyData(null);

          return;
        }

        /**
         * result.data is optional in the action response.
         *
         * Convert undefined -> null because
         * monthlyData state accepts:
         *
         * MonthlyAttendanceData | null
         */
        setMonthlyData(result.data ?? null);
      } catch (error) {
        console.error("Failed to load monthly attendance:", error);

        if (!cancelled) {
          toast.error("Failed to load monthly attendance.");

          setMonthlyData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMonthlyAttendance();

    return () => {
      cancelled = true;
    };
  }, [isMonthlyView, selectedClassId, selectedMonth]);

  /* REFRESH MONTHLY ATTENDANCE */

  const refreshMonthlyAttendance = useCallback(async () => {
    if (!selectedClassId || !selectedMonth) {
      return;
    }

    try {
      const result = await getMonthlyStudentAttendance(
        selectedClassId,
        selectedMonth,
      );

      if (!result.success) {
        toast.error(result.error ?? "Failed to refresh monthly attendance.");

        return;
      }

      setMonthlyData(result.data ?? null);
    } catch (error) {
      console.error("Failed to refresh monthly attendance:", error);

      toast.error("Failed to refresh monthly attendance.");
    }
  }, [selectedClassId, selectedMonth]);

  /* MONTH CHANGE */

  const handleMonthChange = (month: string) => {
    /**
     * Update selected month.
     */
    setSelectedMonth(month);

    /**
     * Always return to monthly overview
     * when month changes.
     */
    setViewMode("MONTH");

    /**
     * Clear old monthly data.
     *
     * The monthly effect will load the
     * newly selected month.
     */
    setMonthlyData(null);

    /**
     * Clear correction state.
     */
    clearSelection();

    setStudents([]);
    setAttendance({});

    /**
     * Current month:
     * correction defaults to today.
     */
    if (month === getCurrentMonth()) {
      const today = getTodayDate();

      setCorrectionDate(today);
      setSelectedDate(today);

      return;
    }

    /**
     * Previous month:
     * correction defaults to first day
     * of selected month.
     */
    const [year, monthNumber] = month.split("-").map(Number);

    const firstDay = `${year}-${String(monthNumber).padStart(2, "0")}-01`;

    setCorrectionDate(firstDay);
    setSelectedDate(firstDay);
  };

  /* OPEN CORRECTION MODE */

  const openCorrectionMode = (studentId: string, date?: string) => {
    const targetDate =
      date ??
      (selectedMonth === getCurrentMonth()
        ? getTodayDate()
        : `${selectedMonth}-01`);

    setCorrectionStudentId(studentId);

    setCorrectionDate(targetDate);

    setSelectedDate(targetDate);

    setViewMode("CORRECTION");
  };

  /* CLOSE CORRECTION MODE */

  const closeCorrectionMode = async () => {
    await refreshMonthlyAttendance();

    setViewMode("MONTH");
    setCorrectionStudentId(null);

    setStudents([]);
    setAttendance({});
    clearSelection();
  };

  /* SAVE HELPERS */

  const addSavingStudents = (studentIds: string[]) => {
    setSavingStudentIds((current) => {
      const next = new Set(current);

      studentIds.forEach((id) => next.add(id));

      return next;
    });
  };

  const removeSavingStudents = (studentIds: string[]) => {
    setSavingStudentIds((current) => {
      const next = new Set(current);

      studentIds.forEach((id) => next.delete(id));

      return next;
    });
  };

  /* PERSIST ATTENDANCE */

  const persistAttendance = async (
    attendanceToSave: Record<string, "PRESENT" | "ABSENT">,
  ) => {
    if (!selectedClassId) {
      toast.error("Please select a class.");

      return false;
    }

    if (!selectedDate) {
      toast.error("Please select an attendance date.");

      return false;
    }

    const studentIds = Object.keys(attendanceToSave);

    if (studentIds.length === 0) {
      return false;
    }

    try {
      addSavingStudents(studentIds);

      const result = await saveStudentAttendance({
        classId: selectedClassId,
        date: selectedDate,
        attendance: attendanceToSave,
      });

      if (!result.success) {
        toast.error(result.error ?? "Failed to save attendance.");

        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to save attendance:", error);

      toast.error("Failed to save attendance.");

      return false;
    } finally {
      removeSavingStudents(studentIds);
    }
  };

  /* INDIVIDUAL ATTENDANCE */

  const handleStatusChange = async (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    if (calendarStatusLoading || calendarBlocked) {
      if (calendarBlockReason) {
        toast.error(calendarBlockReason);
      }

      return;
    }

    if (status !== "PRESENT" && status !== "ABSENT") {
      return;
    }

    if (savingStudentIds.has(studentId)) {
      return;
    }

    const previousStatus = attendance[studentId];

    if (previousStatus === status) {
      handleStudentSelect(studentId, false);

      return;
    }

    /**
     * Optimistic UI update.
     */
    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));

    handleStudentSelect(studentId, false);

    const success = await persistAttendance({
      [studentId]: status,
    });

    if (!success) {
      /**
       * Restore previous state if save fails.
       */
      setAttendance((current) => {
        const next = {
          ...current,
        };

        if (previousStatus) {
          next[studentId] = previousStatus;
        } else {
          delete next[studentId];
        }

        return next;
      });

      return;
    }

    toast.success(
      status === "PRESENT"
        ? "Student marked present."
        : "Student marked absent.",
    );
  };

  const handleCorrectionDateChange = (date: string) => {
    setCorrectionDate(date);
    setSelectedDate(date);
  };

  const toggleStudentHistory = (studentId: string) => {
    setExpandedStudentId((current) =>
      current === studentId ? null : studentId,
    );
  };

  const totalStudents = monthlyData?.students.length ?? 0;

  const paginatedStudents =
    monthlyData?.students.slice(
      (studentPage - 1) * studentPageSize,
      studentPage * studentPageSize,
    ) ?? [];

  useEffect(() => {
    setStudentPage(1);
  }, [selectedClassId, selectedMonth]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalStudents / studentPageSize));

    if (studentPage > totalPages) {
      setStudentPage(totalPages);
    }
  }, [totalStudents, studentPage, studentPageSize]);

  useEffect(() => {
    let cancelled = false;

    const checkCalendarStatus = async () => {
      setCalendarStatusLoading(true);
      setCalendarBlocked(false);
      setCalendarBlockReason(null);

      try {
        const response = await fetch(
          `/api/attendance/calendar-status?date=${encodeURIComponent(selectedDate)}`,
          { cache: "no-store" },
        );

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setCalendarBlocked(true);
          setCalendarBlockReason(
            result.error ?? "Unable to verify the attendance calendar.",
          );
          return;
        }

        setCalendarBlocked(Boolean(result.blocked));
        setCalendarBlockReason(result.reason ?? null);
      } catch {
        if (!cancelled) {
          setCalendarBlocked(true);
          setCalendarBlockReason(
            "Unable to verify the attendance calendar. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setCalendarStatusLoading(false);
        }
      }
    };

    if (selectedDate) {
      void checkCalendarStatus();
    } else {
      setCalendarStatusLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  /* RENDER */

  return (
    <div className={`${isCorrectionView ? "space-y-2" : "space-y-4"}`}>
      {/* PAGE HEADER */}
      <AttendanceHeader
        selectedClassId={selectedClassId}
        selectedMonth={selectedMonth}
        classOptions={classOptions}
        isCorrectionView={isCorrectionView}
        onClassChange={(value) => {
          const nextClassId = value ? Number(value) : null;

          setSelectedClassId(nextClassId);

          // Always return to monthly overview
          setViewMode("MONTH");

          // Clear old monthly data
          setMonthlyData(null);

          // Clear correction data
          setStudents([]);
          setAttendance({});
          clearSelection();
        }}
        onMonthChange={handleMonthChange}
        disabled={loading || saving}
      />

      {/* MONTHLY VIEW */}

      {isMonthlyView ? (
        !selectedClassId ? (
          <EmptyState
            title="Select a class"
            description="Select a class above to view monthly attendance."
          />
        ) : loading ? (
          <MonthlyLoadingState />
        ) : !monthlyData ? (
          <EmptyState
            title="No monthly attendance data"
            description={`No attendance data is available for ${
              selectedClass?.name ?? "the selected class"
            } for ${selectedMonth}.`}
          />
        ) : (
          <div className="space-y-3">
            {/* MONTHLY SUMMARY */}

            <MonthlyAttendanceSummary data={monthlyData} />

            {/* STUDENT MONTHLY ATTENDANCE */}

            <div
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm 
            [&>div:last-child]:!rounded-b-xl [&>div:last-child]:!border-x-0 
            [&>div:last-child]:!border-b-0 [&>div:last-child]:!border-t [&>div:last-child]:!border-slate-200"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                {/* LEFT */}
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900">
                    Student Monthly Attendance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Attendance summary for {selectedClass?.name} •{" "}
                    {selectedMonth}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex shrink-0 items-center gap-3">
                  <AttendanceReportActions
                    classId={selectedClassId}
                    month={selectedMonth}
                    disabled={loading || !monthlyData}
                  />

                  <span className="text-sm text-slate-600">
                    {monthlyData?.totalStudents ?? 0}{" "}
                    {(monthlyData?.totalStudents ?? 0) === 1
                      ? "student"
                      : "students"}
                  </span>
                </div>
              </div>

              {/* TABLE */}
              {monthlyData.students.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <Users className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No active students found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    There are no active students assigned to this class.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="w-14 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          #
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Student
                        </th>

                        {/* KEEP ROLL NO */}
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Roll No
                        </th>

                        {/* REMOVED ADMISSION NO */}

                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Present
                        </th>

                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Absent
                        </th>

                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Pending
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Attendance
                        </th>

                        <th className="w-28 px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedStudents.map((student, index) => {
                        const fullName = [student.name, student.surname]
                          .filter(Boolean)
                          .join(" ");

                        const percentage = Math.min(
                          Math.max(student.attendancePercentage, 0),
                          100,
                        );

                        return (
                          <Fragment key={student.id}>
                            <tr className="transition hover:bg-slate-50/70">
                              {/* INDEX */}

                              <td className="px-5 py-4 text-slate-400">
                                {(studentPage - 1) * studentPageSize +
                                  index +
                                  1}
                              </td>

                              {/* STUDENT */}

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-indigo-50
                                text-indigo-600
                              "
                                  >
                                    <Users className="h-4 w-4" />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-800">
                                      {fullName || student.name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                      Student
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* ROLL NO */}

                              <td className="px-5 py-4">
                                <span
                                  className="
                              inline-flex
                              rounded-md
                              bg-slate-100
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              text-slate-700
                            "
                                >
                                  {student.rollNo || "—"}
                                </span>
                              </td>

                              {/* PRESENT */}

                              <td className="px-5 py-4 text-center">
                                <span
                                  className="
                              inline-flex
                              min-w-[42px]
                              items-center
                              justify-center
                              rounded-md
                              bg-green-50
                              px-2.5
                              py-1
                              font-semibold
                              text-green-700
                            "
                                >
                                  {student.present}
                                </span>
                              </td>

                              {/* ABSENT */}

                              <td className="px-5 py-4 text-center">
                                <span
                                  className="
                              inline-flex
                              min-w-[42px]
                              items-center
                              justify-center
                              rounded-md
                              bg-red-50
                              px-2.5
                              py-1
                              font-semibold
                              text-red-700
                            "
                                >
                                  {student.absent}
                                </span>
                              </td>

                              {/* PENDING */}

                              <td className="px-5 py-4 text-center">
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                                    student.pending > 0
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-50 text-slate-500",
                                  )}
                                >
                                  {student.pending}
                                </span>
                              </td>

                              {/* ATTENDANCE */}

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="
                                h-2
                                flex-1
                                overflow-hidden
                                rounded-full
                                bg-slate-100
                              "
                                  >
                                    <div
                                      className="
                                    h-full
                                    rounded-full
                                    bg-indigo-500
                                    transition-all
                                  "
                                      style={{
                                        width: `${percentage}%`,
                                      }}
                                    />
                                  </div>

                                  <span
                                    className={cn(
                                      "font-semibold",
                                      student.attendancePercentage >= 90
                                        ? "text-green-700"
                                        : student.attendancePercentage >= 75
                                          ? "text-amber-700"
                                          : "text-red-700",
                                    )}
                                  >
                                    {student.attendancePercentage.toFixed(1)}%
                                  </span>
                                </div>
                              </td>

                              {/* ACTION */}

                              <td className="px-5 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleStudentHistory(student.id)
                                    }
                                    className="
        rounded-lg
        border
        border-slate-200
        bg-white
        px-3
        py-1.5
        text-xs
        font-semibold
        text-slate-700
        transition
        hover:bg-slate-50
      "
                                  >
                                    {expandedStudentId === student.id
                                      ? "Hide"
                                      : "History"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openCorrectionMode(student.id)
                                    }
                                    className="
        rounded-lg
        border
        border-indigo-200
        bg-white
        px-3
        py-1.5
        text-xs
        font-semibold
        text-indigo-600
        transition
        hover:bg-indigo-50
      "
                                  >
                                    Correct
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedStudentId === student.id && (
                              <tr className="bg-slate-50/40">
                                <td colSpan={8} className="p-0">
                                  <MonthlyAttendanceHistory
                                    student={student}
                                    month={monthlyData.month}
                                    workingDayKeys={monthlyData.workingDayKeys}
                                    onDateClick={(date) => {
                                      setExpandedStudentId(null);
                                      openCorrectionMode(student.id, date);
                                    }}
                                  />
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGINATION */}
              {totalStudents > 0 && (
                <TablePagination
                  page={studentPage}
                  pageSize={studentPageSize}
                  total={totalStudents}
                  onPageChange={(page) => {
                    setStudentPage(page);
                    setExpandedStudentId(null);
                  }}
                  onPageSizeChange={(size) => {
                    setStudentPageSize(size);
                    setStudentPage(1);
                    setExpandedStudentId(null);
                  }}
                />
              )}
            </div>
          </div>
        )
      ) : null}

      {isCorrectionView &&
        (!selectedClassId ? (
          <EmptyState
            title="Select a class"
            description="Select a class above to load students and view attendance."
          />
        ) : loading ? (
          <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

            <p className="mt-4 text-sm font-medium text-slate-700">
              Loading student attendance...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Loading attendance records for {correctionDate}.
            </p>
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No students found"
            description="There are no active students assigned to this class."
          />
        ) : (
          <div className="space-y-4">
            {/* CORRECTION HEADER */}

            <div
              className="
    flex
    flex-col
    gap-3
    rounded-xl
    border
    border-slate-200
    bg-white
    px-5
    py-4
    shadow-sm

    lg:flex-row
    lg:items-center
    lg:justify-between
  "
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-indigo-500" />

                  <h2 className="text-base font-semibold text-slate-800">
                    Correct Student Attendance
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {correctionStudent?.name ?? "Selected student"}

                  <span className="mx-2 text-slate-300">•</span>

                  {selectedClass?.name ?? "Selected class"}

                  <span className="mx-2 text-slate-300">•</span>

                  {parseDate(correctionDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <AttendanceCorrectionDatePicker
                  value={correctionDate}
                  selectedMonth={selectedMonth}
                  onChange={(date) => {
                    setCorrectionDate(date);
                    setSelectedDate(date);
                    handleCorrectionDateChange(date);
                  }}
                  disabled={saving}
                />

                <button
                  type="button"
                  onClick={closeCorrectionMode}
                  disabled={saving}
                  className="
        h-10
        rounded-lg
        border
        border-slate-200
        bg-white
        px-4
        text-sm
        font-medium
        text-slate-700
        transition

        hover:bg-slate-50

        disabled:cursor-not-allowed
        disabled:opacity-50
      "
                >
                  Back to Monthly Overview
                </button>
              </div>
            </div>

            {/* DAILY SUMMARY */}

            {correctionSummary && (
              <StudentAttendanceDailySummary
                workingDays={correctionSummary.workingDays}
                present={correctionSummary.present}
                absent={correctionSummary.absent}
                pending={correctionSummary.pending}
                attendancePercentage={correctionSummary.attendancePercentage}
              />
            )}

            {calendarBlocked && calendarBlockReason && (
              <div
                role="alert"
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
              >
                {calendarBlockReason}
              </div>
            )}

            {/* DAILY TABLE */}

            {correctionDailyStudent ? (
              <StudentAttendanceTable
                students={[correctionDailyStudent]}
                attendance={attendance}
                onStatusChange={handleStatusChange}
                selectedStudentIds={new Set()}
                allStudentsSelected={false}
                someStudentsSelected={false}
                onStudentSelect={() => {}}
                onSelectAll={() => {}}
                savingStudentIds={savingStudentIds}
                hideSelection
                calendarBlocked={calendarBlocked || calendarStatusLoading}
              />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  Unable to load attendance for the selected student.
                </p>
              </div>
            )}

            {/* DAILY FOOTER */}

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {/* STATUS MESSAGE */}
                <div className="min-w-0 text-sm">
                  {saving ? (
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Loader2 className="h-4 w-4 animate-spin" />

                      <span className="font-medium">Saving attendance...</span>
                    </div>
                  ) : attendance[correctionStudentId ?? ""] === "PRESENT" ? (
                    <p className="font-medium text-green-700">
                      Attendance marked{" "}
                      <span className="font-semibold">Present</span>
                      {" for "}
                      <span className="font-semibold">
                        {correctionStudent
                          ? [correctionStudent.name, correctionStudent.surname]
                              .filter(Boolean)
                              .join(" ")
                          : "this student"}
                      </span>
                      {" on "}
                      <span className="font-semibold">
                        {parseDate(correctionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      .
                    </p>
                  ) : attendance[correctionStudentId ?? ""] === "ABSENT" ? (
                    <p className="font-medium text-red-700">
                      Attendance marked{" "}
                      <span className="font-semibold">Absent</span>
                      {" for "}
                      <span className="font-semibold">
                        {correctionStudent
                          ? [correctionStudent.name, correctionStudent.surname]
                              .filter(Boolean)
                              .join(" ")
                          : "this student"}
                      </span>
                      {" on "}
                      <span className="font-semibold">
                        {parseDate(correctionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      .
                    </p>
                  ) : (
                    <p className="text-slate-500">
                      Attendance is not marked for{" "}
                      <span className="font-semibold text-slate-700">
                        {correctionStudent
                          ? [correctionStudent.name, correctionStudent.surname]
                              .filter(Boolean)
                              .join(" ")
                          : "this student"}
                      </span>
                      {" on "}
                      <span className="font-semibold text-slate-700">
                        {parseDate(correctionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      .
                    </p>
                  )}
                </div>

                {/* AUTO SAVE MESSAGE */}
                <div className="shrink-0 text-xs text-slate-400">
                  Changes are saved automatically.
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

/* MONTHLY LOADING STATE */

function MonthlyLoadingState() {
  return (
    <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>

      <h2 className="mt-4 text-base font-semibold text-slate-800">
        Loading Monthly Attendance
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Calculating attendance for the selected class and month.
      </p>
    </div>
  );
}

/* EMPTY STATE */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex items-center justify-center">
        <Image
          src="/select-class.png"
          alt=""
          width={180}
          height={160}
          className="h-[130px] w-[180px] object-contain"
        />
      </div>

      {/* <h2 className="mt-4 text-lg font-semibold text-slate-800">{title}</h2> */}

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
