"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  X,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  CalendarCheck2,
  CalendarClock,
  Clock3,
  XCircle,
  Plane,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import RadixSelect from "@/components/ui/RadixSelect";
import SummaryCard from "@/components/admin/SummaryCard";

const currentMonth = new Date().getMonth(); // 0 = Jan, 11 = Dec

const months = Array.from({ length: currentMonth + 1 }, (_, index) =>
  new Date(0, index).toLocaleString("default", {
    month: "short",
  }),
);

export default function TeacherMyAttendance() {
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "short" }),
  );

  const [showDropdown, setShowDropdown] = useState(false);

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const [leaveReason, setLeaveReason] = useState("");

  const [leaveDate, setLeaveDate] = useState<Date | null>(new Date());

  const [editingLeaveId, setEditingLeaveId] = useState<number | null>(null);

  const [leaveType, setLeaveType] = useState("SICK");

  const [leaveDuration, setLeaveDuration] = useState("FULL_DAY");

  const [activities, setActivities] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [submittingLeave, setSubmittingLeave] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const [showLeaveDetails, setShowLeaveDetails] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [attendanceSummary, setAttendanceSummary] = useState({
    percentage: 0,

    present: 0,

    absent: 0,

    late: 0,

    leaves: 0,

    workingDays: 0,

    pendingLeaves: 0,

    approvedLeaves: 0,

    rejectedLeaves: 0,
  });

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true);

      const month =
        new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`).getMonth() +
        1;

      const year = new Date().getFullYear();

      const response = await fetch(
        `/api/mobile/teacher/my-attendance?month=${month}&year=${year}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const data = await response.json();

      setActivities(data.activities ?? []);

      setAttendanceSummary({
        percentage: data.summary?.percentage ?? 0,
        present: data.summary?.present ?? 0,
        absent: data.summary?.absent ?? 0,
        late: data.summary?.late ?? 0,
        leaves: data.summary?.leaves ?? 0,
        workingDays: data.summary?.workingDays ?? 0,
        pendingLeaves: data.summary?.pendingLeaves ?? 0,
        approvedLeaves: data.summary?.approvedLeaves ?? 0,
        rejectedLeaves: data.summary?.rejectedLeaves ?? 0,
      });
    } catch (error) {
      console.error(error);

      setActivities([]);

      setAttendanceSummary({
        percentage: 0,
        present: 0,
        absent: 0,
        late: 0,
        leaves: 0,
        workingDays: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    void loadAttendance();
  }, [loadAttendance]);

  const submitLeave = async () => {
    try {
      if (!leaveDate) {
        toast.error("Please select leave date");
        return;
      }

      if (!leaveReason.trim()) {
        toast.error("Please enter leave reason");
        return;
      }

      setSubmittingLeave(true);

      const response = await fetch(
        "/api/mobile/teacher/my-attendance/apply-leave",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            leaveDate: [
              leaveDate.getFullYear(),
              String(leaveDate.getMonth() + 1).padStart(2, "0"),
              String(leaveDate.getDate()).padStart(2, "0"),
            ].join("-"),

            leaveType,

            duration: leaveDuration,

            reason: leaveReason.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to apply leave");
      }

      toast.success("Leave applied successfully.");

      /* Close Bottom Sheet */

      setShowLeaveModal(false);

      /* Reset Form */

      setLeaveDate(new Date());

      setLeaveType("SICK");

      setLeaveDuration("FULL_DAY");

      setLeaveReason("");

      /* Reload Attendance */

      await loadAttendance();
    } catch (error: any) {
      console.error(error);

      toast.error(error.message || "Failed to submit leave");
    } finally {
      setSubmittingLeave(false);
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatLeaveType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDuration = (duration: string) => {
    return duration
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));

  const updateLeave = async () => {
    if (!editingLeaveId) return;

    try {
      setSubmittingLeave(true);

      const response = await fetch(
        `/api/mobile/teacher/my-attendance/leaves/${editingLeaveId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            leaveDate: [
              leaveDate!.getFullYear(),
              String(leaveDate!.getMonth() + 1).padStart(2, "0"),
              String(leaveDate!.getDate()).padStart(2, "0"),
            ].join("-"),

            leaveType,

            duration: leaveDuration,

            reason: leaveReason,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success("Leave updated successfully");

      setEditingLeaveId(null);

      setShowLeaveModal(false);

      await loadAttendance();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmittingLeave(false);
    }
  };

  const deleteLeave = async (id: number) => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/my-attendance/leaves/${id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success(result.message);

      await loadAttendance();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const DetailRow = ({
    label,
    value,
    status = false,
  }: {
    label: string;
    value: string;
    status?: boolean;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>

      {status ? (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeaveStatusColor(value)}`}
        >
          {value}
        </span>
      ) : (
        <span className="font-semibold text-slate-900">{value}</span>
      )}
    </div>
  );

  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => {
    const shouldHideBottomNav =
      showActionSheet ||
      showLeaveModal ||
      showLeaveDetails ||
      deleteId !== null;

    if (shouldHideBottomNav) {
      document.body.classList.add("action-sheet-open");
    } else {
      document.body.classList.remove("action-sheet-open");
    }

    return () => {
      document.body.classList.remove("action-sheet-open");
    };
  }, [showActionSheet, showLeaveModal, showLeaveDetails, deleteId]);

  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between">
          {/* BACK */}

          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>

          {/* MONTH SELECTOR */}

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-11 px-4 rounded-[18px] bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.06)] flex items-center gap-2"
            >
              <CalendarDays size={16} className="text-[#4B517D]" />

              <span className="text-[13px] font-bold text-slate-800">
                {selectedMonth}
              </span>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* DROPDOWN */}

            {showDropdown && (
              <div
                className="absolute right-0 top-14 w-[150px] bg-white rounded-[26px] shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                  border border-slate-100 p-2 z-50"
              >
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month);
                      setShowDropdown(false);
                    }}
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      rounded-2xl
                      transition-all
                      ${
                        selectedMonth === month
                          ? "bg-[#4B517D] text-white"
                          : "hover:bg-[#F8F8FC] text-slate-700"
                      }
                    `}
                  >
                    <span className="text-[14px] font-semibold">{month}</span>

                    {selectedMonth === month && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-7">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-extrabold text-slate-900 leading-none">
              My Attendance
            </h1>

            <Image
              src="/myattendance.png"
              alt="attendance"
              width={28}
              height={28}
            />
          </div>

          <p className="text-[13px] text-slate-400 mt-3">
            Your attendance performance & history
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="mt-6 px-5">
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Present"
            value={attendanceSummary.present}
            icon={CalendarCheck2}
            color="green"
            compact
          />

          <SummaryCard
            title="Absent"
            value={attendanceSummary.absent}
            icon={XCircle}
            color="red"
            compact
          />

          <SummaryCard
            title="Late"
            value={attendanceSummary.late}
            icon={Clock3}
            color="yellow"
            compact
          />

          <SummaryCard
            title="Leaves"
            value={attendanceSummary.approvedLeaves}
            icon={Plane}
            color="blue"
            compact
          />
        </div>
      </div>

      {/* ================= Apply Button ================= */}

      <div className="mt-4 px-5">
        {/* APPLY LEAVE */}

        <div className="mt-5">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="
  flex
  h-[50px]
  w-full
  items-center
  justify-center
  gap-2
  rounded-[18px]
  bg-gradient-to-r
  from-[#4B517D]
  to-[#626991]
  text-[14px]
  font-semibold
  text-white
  shadow-[0_12px_30px_rgba(75,81,125,0.22)]
  transition-all
  duration-200
  active:scale-[0.98]
"
          >
            <CalendarDays size={18} />

            <span>Apply Leave Request</span>
          </button>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY ================= */}

      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-[12px] text-slate-400 mt-1">
              Attendance & Leave Timeline
            </p>
          </div>

          <span className="text-[12px] font-semibold text-[#4B517D]">
            {activities.length} Records
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="py-10 text-center text-slate-400">Loading...</div>
          ) : activities.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-slate-100 px-4 py-3 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FA] text-3xl">
                📅
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No Activity Yet
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Your attendance and leave activities will appear here.
              </p>
            </div>
          ) : (
            activities.map((activity: any) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="bg-white rounded-[22px] border border-slate-100 px-4 py-3 
                shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-all duration-200 active:scale-[0.99]"
              >
                {/* HEADER */}

                <div className="flex items-start justify-between">
                  {/* LEFT */}

                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center 
                      ${
                        activity.type === "LEAVE"
                          ? "bg-violet-50"
                          : activity.status === "PRESENT"
                            ? "bg-green-50"
                            : activity.status === "LATE"
                              ? "bg-yellow-50"
                              : activity.status === "ABSENT"
                                ? "bg-red-50"
                                : "bg-blue-50"
                      }`}
                    >
                      {activity.type === "LEAVE" ? (
                        <CalendarClock size={20} className="text-violet-600" />
                      ) : activity.status === "PRESENT" ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : activity.status === "LATE" ? (
                        <Clock3 size={20} className="text-yellow-600" />
                      ) : activity.status === "ABSENT" ? (
                        <XCircle size={20} className="text-red-600" />
                      ) : (
                        <Plane size={20} className="text-blue-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900">
                        {activity.title}
                      </h3>

                      <p className="text-[12px] text-slate-400 mt-0.5">
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                        activity.type === "ATTENDANCE"
                          ? activity.status === "PRESENT"
                            ? "bg-green-100 text-green-700"
                            : activity.status === "LATE"
                              ? "bg-yellow-100 text-yellow-700"
                              : activity.status === "ABSENT"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                          : getLeaveStatusColor(activity.status)
                      }`}
                    >
                      {formatStatus(activity.status)}
                    </span>

                    {activity.type === "LEAVE" && (
                      <button
                        onClick={() => {
                          setSelectedActivity(activity);
                          setShowActionSheet(true);
                        }}
                        className="
        w-8
        h-8
        rounded-full
        flex
        items-center
        justify-center
        text-slate-500
        hover:bg-slate-100
        transition-colors
      "
                      >
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* FOOTER */}

                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2">
                  <CalendarDays size={14} className="text-slate-400" />

                  <span className="text-[12px] text-slate-500">
                    {formatDate(activity.date)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-end">
          <div className="w-full bg-white rounded-t-[34px] p-6">
            <div className="w-14 h-1.5 rounded-full bg-slate-200 mx-auto mb-6" />

            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="text-red-600" size={28} />
            </div>

            <h2 className="mt-5 text-center text-xl font-bold text-slate-900">
              Delete Leave Request
            </h2>

            <p className="mt-3 text-center text-sm text-slate-500">
              Are you sure you want to delete this leave request?
              <br />
              This action cannot be undone.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-14 rounded-2xl bg-slate-100 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteLeave(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 h-14 rounded-2xl bg-red-500 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEAVE MODAL ================= */}

      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/35">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white px-4 pb-5 pt-5 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
            {/* TOP */}

            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h2 className="text-[23px] font-bold leading-tight text-slate-900">
                  {editingLeaveId ? "Edit Leave" : "Apply Leave"}
                </h2>

                <p className="mt-1 text-[12px] text-slate-400">
                  {editingLeaveId
                    ? "Update your leave request"
                    : "Submit leave request for approval"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  setEditingLeaveId(null);
                }}
                className="
            ml-3
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#F4F6FA]
            text-slate-600
            transition
            active:scale-95
          "
              >
                <X size={17} />
              </button>
            </div>

            {/* LEAVE DATE */}

            <div className="mt-5">
              <label className="text-[11px] font-semibold text-slate-700">
                Leave Date
              </label>

              <div className="mt-1.5">
                <DatePicker
                  selected={leaveDate}
                  onChange={(date: Date | null) => {
                    setLeaveDate(date);
                  }}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Leave Date"
                  wrapperClassName="w-full"
                  popperPlacement="bottom-start"
                  popperClassName="z-[9999]"
                  className="
              h-[44px]
              w-full
              rounded-[15px]
              border
              border-slate-200
              bg-white
              px-3.5
              text-[12px]
              text-slate-700
              outline-none
              transition
              focus:border-[#4B517D]
              focus:ring-2
              focus:ring-[#4B517D]/10
            "
                />
              </div>
            </div>

            {/* LEAVE TYPE */}

            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-700">
                Leave Type
              </label>

              <div className="mt-1.5">
                <RadixSelect
                  value={leaveType}
                  onChange={(value) => setLeaveType(value ?? "SICK")}
                  options={[
                    {
                      value: "SICK",
                      label: "Sick Leave",
                    },
                    {
                      value: "CASUAL",
                      label: "Casual Leave",
                    },
                    {
                      value: "EMERGENCY",
                      label: "Emergency Leave",
                    },
                    {
                      value: "PERSONAL",
                      label: "Personal Leave",
                    },
                  ]}
                />
              </div>
            </div>

            {/* DURATION */}

            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-700">
                Duration
              </label>

              <div className="mt-1.5">
                <RadixSelect
                  value={leaveDuration}
                  onChange={(value) => setLeaveDuration(value ?? "FULL_DAY")}
                  options={[
                    {
                      value: "FULL_DAY",
                      label: "Full Day",
                    },
                    {
                      value: "HALF_DAY",
                      label: "Half Day",
                    },
                  ]}
                />
              </div>
            </div>

            {/* REASON */}

            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-700">
                Reason
              </label>

              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Enter leave reason..."
                className="
            mt-1.5
            h-[88px]
            w-full
            resize-none
            rounded-[18px]
            border
            border-slate-100
            bg-[#F8FAFC]
            p-3.5
            text-[12px]
            text-slate-700
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-[#4B517D]
            focus:bg-white
            focus:ring-2
            focus:ring-[#4B517D]/10
          "
              />
            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  setEditingLeaveId(null);
                  setLeaveDate(new Date());
                  setLeaveType("SICK");
                  setLeaveDuration("FULL_DAY");
                  setLeaveReason("");
                }}
                className="
            h-[48px]
            flex-1
            rounded-[17px]
            bg-[#F1F4F8]
            text-[12px]
            font-semibold
            text-slate-700
            transition
            active:scale-[0.98]
          "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (editingLeaveId) {
                    updateLeave();
                  } else {
                    submitLeave();
                  }
                }}
                disabled={submittingLeave}
                className="
            h-[48px]
            flex-1
            rounded-[17px]
            bg-gradient-to-r
            from-[#4B517D]
            to-[#626991]
            text-[12px]
            font-semibold
            text-white
            shadow-[0_10px_24px_rgba(75,81,125,0.22)]
            transition
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
              >
                {submittingLeave
                  ? "Saving..."
                  : editingLeaveId
                    ? "Update Leave"
                    : "Submit Leave"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEAVE DETAILS ================= */}

      {showLeaveDetails && selectedLeave && (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/40">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[32px] bg-white px-5 pb-6 pt-4 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
            {/* HANDLE */}

            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            {/* HEADER */}

            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-slate-900">
                Leave Details
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowLeaveDetails(false);
                  setSelectedLeave(null);
                }}
                className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#F4F6FA]
            text-slate-600
            transition
            active:scale-95
          "
              >
                <X size={17} />
              </button>
            </div>

            {/* DETAILS */}

            <div className="mt-5 space-y-4">
              <DetailRow
                label="Leave Date"
                value={formatDate(selectedLeave.date)}
              />

              <DetailRow
                label="Leave Type"
                value={formatLeaveType(selectedLeave.leaveType)}
              />

              <DetailRow
                label="Duration"
                value={formatDuration(selectedLeave.duration)}
              />

              <DetailRow label="Status" value={selectedLeave.status} status />

              <DetailRow
                label="Applied On"
                value={formatDate(selectedLeave.createdAt)}
              />

              <div>
                <p className="mb-2 text-[11px] font-medium text-slate-400">
                  Reason
                </p>

                <div className="rounded-[18px] bg-[#F8FAFC] p-3.5 text-[13px] leading-5 text-slate-700">
                  {selectedLeave.reason}
                </div>
              </div>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => {
                setShowLeaveDetails(false);
                setSelectedLeave(null);
              }}
              className="
          mt-6
          h-[48px]
          w-full
          rounded-[17px]
          bg-gradient-to-r
          from-[#4B517D]
          to-[#626991]
          text-[13px]
          font-semibold
          text-white
          shadow-[0_10px_24px_rgba(75,81,125,0.20)]
          transition
          active:scale-[0.98]
        "
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= ACTION SHEET ================= */}

      {showActionSheet && selectedActivity && (
        <div className="fixed inset-0 z-[9998] flex items-end bg-black/40">
          <div
            className="
        relative
        z-[9999]
        w-full
        max-h-[85vh]
        overflow-y-auto
        rounded-t-[34px]
        bg-white
        px-5
        pb-6
        pt-3
        shadow-[0_-12px_40px_rgba(15,23,42,0.16)]
        animate-slide-up
      "
          >
            {/* Handle */}

            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />

            {/* Header */}

            <div className="relative border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 pr-9">
                {/* Leave Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA]">
                  <CalendarDays size={19} className="text-[#4B517D]" />
                </div>

                {/* Leave Details */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[14px] font-bold text-slate-900">
                      {selectedActivity.title}
                    </h2>

                    <span
                      className={`
                  shrink-0
                  rounded-full
                  px-2
                  py-0.5
                  text-[8px]
                  font-semibold
                  ${getLeaveStatusColor(selectedActivity.status)}
                `}
                    >
                      {formatStatus(selectedActivity.status)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-400">
                    <span>{formatDate(selectedActivity.date)}</span>

                    <span className="text-slate-300">•</span>

                    <span>
                      {selectedActivity.leaveType
                        ?.replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (letter: string) =>
                          letter.toUpperCase(),
                        )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close */}

              <button
                type="button"
                onClick={() => setShowActionSheet(false)}
                className="
            absolute
            right-0
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-slate-50
            text-slate-400
            transition
            active:scale-95
          "
              >
                <X size={15} />
              </button>
            </div>

            {/* Actions */}

            <div className="pt-2">
              {/* View Details */}

              <button
                type="button"
                onClick={() => {
                  setShowActionSheet(false);
                  setSelectedLeave(selectedActivity);
                  setShowLeaveDetails(true);
                }}
                className="
            flex
            h-12
            w-full
            items-center
            gap-4
            rounded-2xl
            px-4
            text-left
            transition
            hover:bg-slate-50
            active:bg-slate-50
          "
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FA]">
                  <Eye size={17} className="text-[#4B517D]" />
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-slate-800">
                    View Details
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    View complete leave request details
                  </p>
                </div>
              </button>

              {/* Edit Request */}

              {selectedActivity.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowActionSheet(false);

                    setEditingLeaveId(selectedActivity.id);
                    setLeaveDate(new Date(selectedActivity.date));
                    setLeaveType(selectedActivity.leaveType);
                    setLeaveDuration(selectedActivity.duration);
                    setLeaveReason(selectedActivity.reason);

                    setShowLeaveModal(true);
                  }}
                  className="
              flex
              h-12
              w-full
              items-center
              gap-4
              rounded-2xl
              px-4
              text-left
              transition
              hover:bg-orange-50/60
              active:bg-orange-50
            "
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                    <Pencil size={17} className="text-[#F59A23]" />
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      Edit Request
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-400">
                      Update leave request information
                    </p>
                  </div>
                </button>
              )}

              {/* Delete Request */}

              {selectedActivity.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowActionSheet(false);
                    setDeleteId(selectedActivity.id);
                  }}
                  className="
              flex
              h-12
              w-full
              items-center
              gap-4
              rounded-2xl
              px-4
              text-left
              transition
              hover:bg-red-50
              active:bg-red-50
            "
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                    <Trash2 size={17} className="text-red-500" />
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-red-600">
                      Delete Request
                    </p>

                    <p className="mt-0.5 text-[9px] text-red-400">
                      Permanently remove this leave request
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* Cancel */}

            <button
              type="button"
              onClick={() => setShowActionSheet(false)}
              className="
          mt-3
          h-11
          w-full
          rounded-2xl
          bg-[#F1F4F8]
          text-[12px]
          font-semibold
          text-slate-700
          transition
          active:scale-[0.98]
        "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
