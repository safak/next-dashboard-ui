"use client";

import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import LoadingState from "@/components/admin/LoadingState";
import DataTable from "@/components/admin/DataTable";
import TablePagination from "@/components/ui/TablePagination";
import EmptyTeacherAttendance from "./EmptyTeacherAttendance";
import AttendanceSummary from "./AttendanceSummary";
import AttendanceBottomSheet from "./AttendanceBottomSheet";
import AttendanceColumns, { TeacherAttendance } from "./AttendanceColumns";
import TeacherAttendanceToolbar, {
  AttendanceFilter,
  AttendanceSortOption,
} from "./TeacherAttendanceToolbar";

interface Summary {
  totalTeachers: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  pending: number;
}

function getTodayDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateValue(date: Date | null) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSundayDate(value: string) {
  const date = parseDate(value);

  return date?.getDay() === 0;
}

export default function TeacherAttendanceDashboard() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<Summary | null>(null);

  const [teachers, setTeachers] = useState<TeacherAttendance[]>([]);

  const [date, setDate] = useState<string>(() => getTodayDate());

  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [calendarBlockReason, setCalendarBlockReason] = useState<string | null>(
    null,
  );
  const [calendarStatusLoading, setCalendarStatusLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<AttendanceSortOption>("name-asc");

  const [attendanceFilter, setAttendanceFilter] =
    useState<AttendanceFilter>("all");

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherAttendance | null>(null);

  const [showAttendanceSheet, setShowAttendanceSheet] = useState(false);

  const loadAttendance = async (selectedDate: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/teachers/attendance?date=${encodeURIComponent(
          selectedDate,
        )}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load teacher attendance");
      }

      const data = await response.json();

      setSummary(data.summary ?? null);
      setTeachers(data.teachers ?? []);
      setPage(1);
    } catch (error) {
      console.error("Failed to load teacher attendance:", error);

      setSummary(null);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance(date);
  }, [date]);

  useEffect(() => {
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
          return;
        }

        setCalendarBlocked(Boolean(result.blocked));
        setCalendarBlockReason(result.reason ?? null);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to check attendance calendar:", error);
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
  }, [date]);

  const filteredTeachers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...teachers]
      .filter((teacher) => {
        if (!keyword) {
          return true;
        }

        const fullName = `${teacher.name} ${teacher.surname}`.toLowerCase();

        const email = teacher.email?.toLowerCase() ?? "";

        const phone = teacher.phone?.toLowerCase() ?? "";

        return (
          fullName.includes(keyword) ||
          email.includes(keyword) ||
          phone.includes(keyword)
        );
      })
      .filter((teacher) => {
        if (attendanceFilter === "marked") {
          return teacher.isMarked;
        }

        if (attendanceFilter === "pending") {
          return !teacher.isMarked;
        }

        return true;
      })
      .sort((a, b) => {
        const nameA = `${a.name} ${a.surname}`.toLowerCase();

        const nameB = `${b.name} ${b.surname}`.toLowerCase();

        switch (sortBy) {
          case "name-desc":
            return nameB.localeCompare(nameA);

          case "status":
            return (a.status ?? "PENDING").localeCompare(b.status ?? "PENDING");

          case "marked-first":
            return Number(b.isMarked) - Number(a.isMarked);

          case "pending-first":
            return Number(a.isMarked) - Number(b.isMarked);

          case "name-asc":
          default:
            return nameA.localeCompare(nameB);
        }
      });
  }, [teachers, search, sortBy, attendanceFilter]);

  const totalRecords = filteredTeachers.length;

  const paginatedTeachers = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredTeachers.slice(start, start + pageSize);
  }, [filteredTeachers, page, pageSize]);

  const activeFilterCount = attendanceFilter !== "all" ? 1 : 0;

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, attendanceFilter, date]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const handleMark = (teacher: TeacherAttendance) => {
    if (calendarStatusLoading || calendarBlocked) {
      if (calendarBlockReason) {
        // Show the reason if a user tries to open attendance.
        console.warn(calendarBlockReason);
      }
      return;
    }

    setSelectedTeacher(teacher);
    setShowAttendanceSheet(true);
  };

  const handleCloseSheet = () => {
    setShowAttendanceSheet(false);
    setSelectedTeacher(null);
  };

  const handleRefresh = () => {
    loadAttendance(date);
  };

  const selectedDate = parseDate(date);

  const attendanceDisabled = calendarBlocked || calendarStatusLoading;

  if (loading) {
    return <LoadingState cards={6} rows={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <PageHeader
            title="Teacher Attendance"
            subtitle="Manage teacher attendance records."
            image="/teacherAttendance-icon.png"
            imageClassName="h-10 w-10"
          />
        </div>

        <div className="shrink-0 pt-1">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <DatePicker
              selected={selectedDate}
              onChange={(newDate: Date | null) => {
                if (!newDate) {
                  return;
                }

                setDate(formatDateValue(newDate));
              }}
              dateFormat="dd MMM yyyy"
              placeholderText="Select date"
              maxDate={new Date()}
              showPopperArrow={false}
              popperPlacement="bottom-end"
              popperClassName="!z-[9999]"
              wrapperClassName="w-full"
              className="h-10 w-[165px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>
      </div>

      {calendarBlocked && calendarBlockReason && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
        >
          <p className="mt-1 text-sm text-amber-700">{calendarBlockReason}</p>
        </div>
      )}

      <AttendanceSummary summary={summary} loading={loading} />

      <TeacherAttendanceToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        attendanceFilter={attendanceFilter}
        onAttendanceFilterChange={setAttendanceFilter}
        total={totalRecords}
        onRefresh={handleRefresh}
        activeFilterCount={activeFilterCount}
      />

      {filteredTeachers.length === 0 ? (
        <EmptyTeacherAttendance
          search={search}
          hasActiveFilters={attendanceFilter !== "all"}
        />
      ) : (
        <>
          <DataTable
            columns={AttendanceColumns({
              onMark: handleMark,
              attendanceDisabled: calendarStatusLoading || calendarBlocked,
              attendanceBlockReason: calendarBlockReason,
            })}
            data={paginatedTeachers}
            rowKey={(teacher) => teacher.teacherId}
            rowClassName={(teacher) => (!teacher.isMarked ? "bg-amber-50" : "")}
          />

          <TablePagination
            page={page}
            pageSize={pageSize}
            total={totalRecords}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}

      <AttendanceBottomSheet
        open={showAttendanceSheet}
        teacher={selectedTeacher}
        date={date}
        onClose={handleCloseSheet}
        onSuccess={() => loadAttendance(date)}
      />
    </div>
  );
}
