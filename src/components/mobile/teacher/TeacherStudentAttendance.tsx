"use client";

import {
  ArrowLeft,
  ChevronDown,
  Search,
  X,
  Download,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCallback, useEffect, useMemo, useState } from "react";
import SummaryCard from "@/components/admin/SummaryCard";

export default function TeacherStudentAttendance() {
  const router = useRouter();

  /* ================= STATES ================= */

  const [classes, setClasses] = useState<any[]>([]);

  const [students, setStudents] = useState<any[]>([]);

  const [selectedClass, setSelectedClass] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  const [search, setSearch] = useState("");

  const [attendance, setAttendance] = useState<any>({});

  const [saved, setSaved] = useState(false);

  const [loading, setLoading] = useState(true);

  const [attendanceLocked, setAttendanceLocked] = useState(false);

  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [calendarBlockReason, setCalendarBlockReason] = useState<string | null>(
    null,
  );
  const [calendarStatusLoading, setCalendarStatusLoading] = useState(true);

  const [savingAttendance, setSavingAttendance] = useState(false);

  const [showReasonSheet, setShowReasonSheet] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [selectedReason, setSelectedReason] = useState("");

  const [showReportsSheet, setShowReportsSheet] = useState(false);

  useEffect(() => {
    if (showReportsSheet || showReasonSheet) {
      document.body.classList.add("action-sheet-open");
    } else {
      document.body.classList.remove("action-sheet-open");
    }

    return () => {
      document.body.classList.remove("action-sheet-open");
    };
  }, [showReportsSheet, showReasonSheet]);

  const absenceReasons = [
    "Sick Leave",
    "Medical Appointment",
    "Family Function",
    "Personal Leave",
    "Emergency",
    "Other",
  ];

  const [weeklyAttendance, setWeeklyAttendance] = useState<any>({});

  /* ================= ATTENDANCE CALENDAR LOCK ================= */

  useEffect(() => {
    let cancelled = false;

    const checkCalendarStatus = async () => {
      setCalendarStatusLoading(true);
      setCalendarBlocked(false);
      setCalendarBlockReason(null);

      try {
        const now = new Date();

        const indiaTime = new Date(
          now.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
        );

        const todayKey = [
          indiaTime.getFullYear(),
          String(indiaTime.getMonth() + 1).padStart(2, "0"),
          String(indiaTime.getDate()).padStart(2, "0"),
        ].join("-");

        const response = await fetch(
          `/api/attendance/calendar-status?date=${todayKey}`,
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

        setAttendanceLocked(indiaTime.getHours() >= 17);
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
    };

    void checkCalendarStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ================= FETCH CLASSES ================= */

  const fetchClasses = useCallback(async () => {
    try {
      const response = await fetch("/api/mobile/teacher/classes");

      const data = await response.json();

      setClasses(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        setSelectedClass(data[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  }, []);

  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  const fetchWeeklyAttendance = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/weekly-attendance?className=${selectedClass}`,
      );

      const data = await response.json();

      const map: any = {};

      data.forEach((record: any) => {
        const date = new Date(record.createdAt);

        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

        if (!map[record.studentId]) {
          map[record.studentId] = Array(6).fill(null);
        }

        map[record.studentId][dayIndex] = record.status;
      });

      setWeeklyAttendance(map);
    } catch (error) {
      console.error(error);
    }
  }, [selectedClass]);

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/mobile/teacher/students?className=${selectedClass}`,
      );

      const data = await response.json();

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch students:", error);

      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/attendance?className=${selectedClass}`,
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        return;
      }

      const attendanceMap: any = {};

      data.forEach((record: any) => {
        attendanceMap[record.studentId] = {
          status: record.status,
          remarks: record.remarks,
          updatedAt: record.updatedAt,
        };
      });

      setAttendance(attendanceMap);
    } catch (error) {
      console.error("Attendance fetch failed", error);
    }
  }, [selectedClass]);

  /* ================= FILTER ================= */

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) =>
      student.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  /* ================= UPDATE ATTENDANCE ================= */

  const updateAttendance = (studentId: string, status: string) => {
    if (attendanceControlsDisabled) {
      if (calendarBlockReason) toast.error(calendarBlockReason);
      return;
    }

    setAttendance((prev: any) => ({
      ...prev,
      [studentId]: {
        status,
        remarks: status === "present" ? null : prev[studentId]?.remarks,
        updatedAt: new Date(),
      },
    }));
  };

  const submitAbsentReason = () => {
    if (attendanceControlsDisabled) {
      if (calendarBlockReason) toast.error(calendarBlockReason);
      setShowReasonSheet(false);
      return;
    }

    if (!selectedStudent || !selectedReason) return;

    setAttendance((prev: any) => ({
      ...prev,

      [selectedStudent.id]: {
        status: "absent",

        remarks: selectedReason,

        updatedAt: new Date(),
      },
    }));

    setShowReasonSheet(false);

    setSelectedReason("");

    setSelectedStudent(null);
  };

  /* ================= MARK ALL PRESENT ================= */

  const markAllPresent = () => {
    if (attendanceControlsDisabled) {
      if (calendarBlockReason) toast.error(calendarBlockReason);
      return;
    }

    const updated: any = {};

    filteredStudents.forEach((student: any) => {
      updated[student.id] = {
        status: "present",
        updatedAt: new Date(),
      };
    });

    setAttendance(updated);
  };

  const saveAttendance = async () => {
    try {
      if (calendarStatusLoading || calendarBlocked || attendanceLocked) {
        toast.error(
          calendarBlockReason ??
            (attendanceLocked
              ? "Attendance is locked after 5 PM."
              : "Unable to verify the attendance calendar."),
        );
        return;
      }

      if (!selectedClass) {
        toast.error("Please select a class");
        return;
      }

      if (Object.keys(attendance).length === 0) {
        toast.error("Please mark attendance for at least one student");
        return;
      }

      setSavingAttendance(true);

      const response = await fetch("/api/mobile/teacher/attendance/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: selectedClass,
          attendance,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save attendance");
      }

      await Promise.all([
        fetchAttendance(),
        fetchAttendanceStatus(),
        fetchWeeklyAttendance(),
      ]);

      setSaved(true);

      toast.success("Attendance saved successfully");

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save attendance:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving attendance",
      );
    } finally {
      setSavingAttendance(false);
    }
  };

  const [attendanceStatus, setAttendanceStatus] = useState({
    submitted: false,
    markedStudents: 0,
    lastUpdated: null as string | null,
  });

  const fetchAttendanceStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/attendance/status?className=${selectedClass}`,
      );

      const data = await response.json();

      setAttendanceStatus(data);
    } catch (error) {
      console.error(error);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedClass) return;

    void Promise.all([
      fetchStudents(),
      fetchAttendance(),
      fetchAttendanceStatus(),
      fetchWeeklyAttendance(),
    ]);
  }, [
    selectedClass,
    fetchStudents,
    fetchAttendance,
    fetchAttendanceStatus,
    fetchWeeklyAttendance,
  ]);

  const downloadReport = async (
    month: number,
    year: number,
    format: "excel" | "pdf",
  ) => {
    try {
      const response = await fetch(
        "/api/mobile/teacher/reports/monthly-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className: selectedClass,
            month,
            year,
            format,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.error ||
            `Failed to generate ${format.toUpperCase()} report`,
        );
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("The generated report is empty");
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download =
        format === "excel" ? "AttendanceReport.xlsx" : "AttendanceReport.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Attendance report download error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to download attendance report",
      );

      throw error;
    }
  };

  const totalStudents = filteredStudents.length;

  const presentCount = Object.values(attendance).filter(
    (x: any) => x?.status === "present",
  ).length;

  const absentCount = Object.values(attendance).filter(
    (x: any) => x?.status === "absent",
  ).length;

  const pendingCount = Math.max(
    totalStudents - Object.keys(attendance).length,
    0,
  );

  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);

  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  const [reportFormat, setReportFormat] = useState<"excel" | "pdf">("excel");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [downloadingReport, setDownloadingReport] = useState(false);

  // Calendar restrictions are resolved by the server so Sundays,
  // second Saturdays, and full-day holidays use the same school calendar.
  const attendanceControlsDisabled =
    calendarStatusLoading || calendarBlocked || attendanceLocked;

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-y-auto pb-40">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          {/* BACK */}

          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>

          {/* RIGHT SECTION */}

          <div className="flex items-center gap-2">
            {/* CLASS SELECTOR */}

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="
            h-11
            px-4
            rounded-[18px]
            bg-white
            border
            border-slate-100
            shadow-[0_8px_24px_rgba(15,23,42,0.06)]
            flex
            items-center
            gap-2
          "
              >
                <div className="h-2 w-2 rounded-full bg-[#F59A23]" />

                <span className="text-[13px] font-bold text-slate-800">
                  {selectedClass}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}

              {showDropdown && (
                <div className="absolute right-0 top-14 w-[180px] bg-white rounded-[26px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-slate-100 p-2 z-50">
                  {classes.map((cls: any) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls.name);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all
                  ${
                    selectedClass === cls.name
                      ? "bg-[#4B517D] text-white"
                      : "text-slate-700 hover:bg-[#F7F4FD]"
                  }`}
                    >
                      <span className="text-[14px] font-semibold">
                        {cls.name}
                      </span>

                      {selectedClass === cls.name && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* REPORTS BUTTON */}

            <button
              onClick={() => setShowReportsSheet(true)}
              className="
  flex h-10 w-11 items-center justify-center
  rounded-[16px]
  bg-[#4B517D]
  text-white
  shadow-[0_10px_24px_rgba(75,81,125,0.22)]
  transition-all
  active:scale-95
"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-7">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-extrabold text-slate-900 leading-none">
              Student Attendance
            </h1>

            <Image
              src="/attendance.png"
              alt="attendance"
              width={18}
              height={18}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Mark attendance for today&apos;s classes
          </p>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="mt-4 px-4">
        <div className="h-[40px] bg-white rounded-[22px] px-4 flex items-center gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <Search size={14} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search student........"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px]"
          />
        </div>
      </div>

      {calendarBlocked && calendarBlockReason && (
        <div
          role="alert"
          className="mx-4 mt-4 rounded-[18px] border border-amber-200 bg-amber-50 p-3"
        >
          <p className="text-center text-sm font-semibold text-amber-700">
            {calendarBlockReason}
          </p>
        </div>
      )}

      {calendarStatusLoading && (
        <div className="mx-4 mt-4 rounded-[18px] border border-slate-200 bg-white p-3">
          <p className="text-center text-sm text-slate-500">
            Checking school calendar...
          </p>
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      <div className="mt-4 px-4">
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard
            title="Present"
            value={presentCount}
            subtitle={`${presentCount} / ${totalStudents} students`}
            icon={CheckCircle2}
            color="green"
            compact
          />

          <SummaryCard
            title="Absent"
            value={absentCount}
            subtitle={`${absentCount} / ${totalStudents} students`}
            icon={XCircle}
            color="red"
            compact
          />

          <SummaryCard
            title="Pending"
            value={pendingCount}
            subtitle={`${pendingCount} / ${totalStudents} students`}
            icon={Clock3}
            color="yellow"
            compact
          />
        </div>
      </div>

      {/* ================= MARK ALL ================= */}

      <div className="mt-4 px-4">
        <button
          onClick={markAllPresent}
          disabled={attendanceControlsDisabled}
          className={`w-full h-[48px] rounded-[18px] text-[14px] font-bold transition-all
            ${
              attendanceLocked
                ? "bg-slate-200 text-slate-500"
                : "bg-[#EAF8D8] text-[#4B7F16]"
            }
          `}
        >
          {attendanceLocked ? "Attendance Locked" : "Mark All Present"}
        </button>
      </div>

      {/* ================= STUDENTS ================= */}

      <div className="mt-4 px-4 space-y-4">
        {loading ? (
          <div className="pt-16 flex justify-center">
            <p className="text-sm text-slate-400">Loading students...</p>
          </div>
        ) : (
          <>
            {filteredStudents.map((student: any) => {
              const attendanceRecord = attendance[student.id];

              const status = attendanceRecord?.status;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-[22px] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                >
                  {/* TOP ROW */}

                  <div className="flex items-center justify-between">
                    {/* LEFT SIDE */}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                        <Image
                          src={
                            student.img
                              ? student.img
                              : student.sex?.toLowerCase() === "female"
                                ? "/girl.png"
                                : student.sex?.toLowerCase() === "male"
                                  ? "/boy.png"
                                  : "/student-avatar.png"
                          }
                          alt={student.name}
                          width={60}
                          height={60}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <h3 className="text-[15px] font-bold text-slate-900">
                          {student.name}
                        </h3>

                        <span className="text-[11px] text-slate-400">
                          ({student.id.slice(-6)})
                        </span>
                      </div>
                    </div>

                    {/* PRESENT / ABSENT TOGGLE */}

                    <div className="flex h-[28px] rounded-[10px] border border-slate-200 overflow-hidden w-[140px] shrink-0">
                      <button
                        disabled={attendanceControlsDisabled}
                        onClick={() => updateAttendance(student.id, "present")}
                        className={`flex-1 text-[11px] font-semibold transition-all
                          ${
                            status === "present"
                              ? "bg-[#7ED957] text-white"
                              : "bg-white text-slate-600"
                          }
                          ${attendanceControlsDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Present
                      </button>

                      <button
                        disabled={attendanceControlsDisabled}
                        onClick={() => {
                          setSelectedStudent(student);
                          setSelectedReason("");
                          setShowReasonSheet(true);
                        }}
                        className={`flex-1 text-[11px] font-semibold transition-all
                          ${
                            status === "absent"
                              ? "bg-[#FF6B81] text-white"
                              : "bg-white text-slate-600"
                          }
                          ${attendanceControlsDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>

                  {/* WEEK ATTENDANCE */}

                  <div className="mt-4">
                    <div className="flex justify-between px-1">
                      {["M", "T", "W", "T", "F", "S"].map((day, index) => {
                        const weekStatus =
                          weeklyAttendance[student.id]?.[index];

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-3 h-3 rounded-full
                                ${
                                  weekStatus === "present"
                                    ? "bg-green-500"
                                    : weekStatus === "absent"
                                      ? "bg-red-500"
                                      : weekStatus === "leave"
                                        ? "bg-yellow-500"
                                        : "bg-slate-300"
                                }
                              `}
                            />

                            <span className="text-[11px] text-slate-400 mt-1">
                              {day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ABSENT REASON */}

                  {attendanceRecord?.remarks && (
                    <div className="mt-3">
                      <span className="text-[11px] text-red-500 font-medium">
                        â— {attendanceRecord.remarks}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* EMPTY */}

            {!loading && filteredStudents.length === 0 && (
              <div className="pt-12 flex flex-col items-center">
                <Image
                  src="/notifications.png"
                  alt="empty"
                  width={38}
                  height={38}
                />

                <h3 className="mt-5 text-[18px] font-bold text-slate-700">
                  No Students Found
                </h3>

                <p className="text-[13px] text-slate-400 mt-2">
                  Try another class
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {showReasonSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => {
              setShowReasonSheet(false);
              setSelectedReason("");
              setSelectedStudent(null);
            }}
          />

          <div
            className="
    fixed
    bottom-0
    left-0
    right-0
    z-[9998]
    max-h-[85vh]
    overflow-y-auto
    rounded-t-[32px]
    bg-white
    px-5
    pb-[100px]
    pt-5
  "
          >
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-900">
                Mark Student Absent
              </h3>

              <button
                onClick={() => {
                  setShowReasonSheet(false);
                  setSelectedReason("");
                  setSelectedStudent(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-slate-500 mt-1">
              {selectedStudent?.name}
            </p>

            <div className="mt-5 space-y-2">
              {absenceReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full h-[48px] rounded-[16px] border px-4 text-left font-medium
                ${
                  selectedReason === reason
                    ? "border-[#4B517D] bg-[#EEF0F8] text-[#4B517D]"
                    : "border-slate-200"
                }
              `}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReasonSheet(false);
                  setSelectedReason("");
                  setSelectedStudent(null);
                }}
                className="flex-1 h-[50px] rounded-[18px] bg-slate-100 font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={!selectedReason}
                onClick={submitAbsentReason}
                className="
  flex-1
  h-[50px]
  rounded-[18px]
  bg-gradient-to-r
  from-[#4B517D]
  to-[#626991]
  text-white
  font-semibold
  shadow-[0_10px_25px_rgba(75,81,125,0.18)]
  disabled:opacity-50
"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= REPORTS SHEET ================= */}

      {showReportsSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowReportsSheet(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-5 z-[100]">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-900">
                Attendance Reports
              </h3>

              <button
                onClick={() => setShowReportsSheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* MONTH */}

            <div className="mt-5">
              <label className="text-[13px] font-medium text-slate-600">
                Month
              </label>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setReportMonth(index + 1)}
                    className={`
          h-[42px]
          rounded-[14px]
          text-[12px]
          font-semibold
          transition-all
          ${
            reportMonth === index + 1
              ? "bg-gradient-to-r from-[#4B517D] to-[#626991] text-white"
              : "bg-slate-100 text-slate-700"
          }
        `}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* FORMAT */}

            <div className="mt-5">
              <label className="text-[13px] font-medium text-slate-600">
                Format
              </label>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setReportFormat("excel")}
                  className={`flex-1 h-[48px] rounded-[16px] font-semibold ${
                    reportFormat === "excel"
                      ? "bg-gradient-to-r from-[#4B517D] to-[#626991] text-white"
                      : "bg-slate-100"
                  }`}
                >
                  Excel
                </button>

                <button
                  onClick={() => setReportFormat("pdf")}
                  className={`flex-1 h-[48px] rounded-[16px] font-semibold ${
                    reportFormat === "pdf"
                      ? "bg-gradient-to-r from-[#4B517D] to-[#626991] text-white"
                      : "bg-slate-100"
                  }`}
                >
                  PDF
                </button>
              </div>
            </div>

            {/* DOWNLOAD */}

            <button
              type="button"
              disabled={downloadingReport}
              onClick={async () => {
                try {
                  setDownloadingReport(true);

                  await downloadReport(reportMonth, reportYear, reportFormat);

                  toast.success(
                    `${reportFormat.toUpperCase()} report downloaded successfully`,
                  );

                  setShowReportsSheet(false);
                } catch (error) {
                  console.error("Report download failed:", error);
                } finally {
                  setDownloadingReport(false);
                }
              }}
              className={`
    mb-2
    mt-6
    h-[54px]
    w-full
    rounded-[18px]
    text-[14px]
    font-bold
    transition-all
    active:scale-[0.98]

    ${
      downloadingReport
        ? "cursor-not-allowed bg-slate-300 text-white"
        : "bg-gradient-to-r from-[#4B517D] to-[#626991] text-white shadow-[0_12px_30px_rgba(75,81,125,0.20)]"
    }
  `}
            >
              {downloadingReport
                ? "Generating Report..."
                : `Download ${reportFormat.toUpperCase()}`}
            </button>
          </div>
        </>
      )}

      {/* ================= SAVE BUTTON ================= */}

      {!showReasonSheet && (
        <div
          className="
    fixed
    bottom-[82px]
    left-0
    right-0
    z-[60]
    bg-gradient-to-t
    from-[#F5F6FA]
    via-[#F5F6FA]/95
    to-transparent
    px-4
    pb-3
    pt-3
  "
        >
          <button
            onClick={saveAttendance}
            disabled={attendanceControlsDisabled || savingAttendance}
            className={`
        h-[54px]
        w-full
        rounded-[20px]
        text-[14px]
        font-bold
        transition-all
        duration-300
        active:scale-[0.98]

        ${
          attendanceControlsDisabled || savingAttendance
            ? "cursor-not-allowed bg-slate-300 text-slate-600 shadow-none"
            : saved
              ? "bg-[#7ED957] text-white shadow-[0_15px_35px_rgba(126,217,87,0.22)]"
              : "bg-gradient-to-r from-[#4B517D] to-[#626991] text-white shadow-[0_18px_40px_rgba(75,81,125,0.25)]"
        }
      `}
          >
            {calendarStatusLoading
              ? "Checking Calendar..."
              : calendarBlocked
                ? "Attendance Unavailable"
                : attendanceLocked
                  ? "Attendance Locked"
                  : savingAttendance
                  ? "Saving..."
                  : saved
                    ? "Attendance Saved âœ“"
                    : "Save Attendance"}
          </button>
        </div>
      )}
    </div>
  );
}

