"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  MoreVertical,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  ClipboardList,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Assignment {
  id: number;
  title: string;
  description?: string;
  totalMarks: number;
  dueDate: string;
  lesson?: {
    subject?: {
      name: string;
    };
  };
}

interface ClassItem {
  id: number;
  name: string;
}

export default function TeacherAssignments() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAssignments();
    }
  }, [selectedClass]);

  useEffect(() => {
    const shouldHideBottomNav = showActionSheet || deleteId !== null;

    if (shouldHideBottomNav) {
      document.body.classList.add("action-sheet-open");
    } else {
      document.body.classList.remove("action-sheet-open");
    }

    return () => {
      document.body.classList.remove("action-sheet-open");
    };
  }, [showActionSheet, deleteId]);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/classes");

      const data = await response.json();

      const classList = Array.isArray(data) ? data : [];

      setClasses(classList);

      if (classList.length > 0) {
        setSelectedClass(classList[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/mobile/teacher/assignments", {
        cache: "no-store",
      });

      const data = await response.json();

      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/assignments/${assignmentId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete assignment");
      }

      setDeleteId(null);
      setSelectedAssignment(null);
      setShowActionSheet(false);

      toast.success("Assignment deleted successfully");

      await fetchAssignments();
    } catch (error) {
      console.error("Delete assignment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete assignment",
      );
    }
  };

  const activeAssignments = assignments.filter(
    (item) => new Date(item.dueDate) >= new Date(),
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAssignmentStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();

    if (due < now) {
      return {
        label: "Overdue",
        className: "bg-red-50 text-red-600",
      };
    }

    return {
      label: "Active",
      className: "bg-green-50 text-green-600",
    };
  };

  const openActionSheet = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowActionSheet(true);
  };

  const closeActionSheet = () => {
    setShowActionSheet(false);

    setTimeout(() => {
      setSelectedAssignment(null);
    }, 150);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between">
          {/* Back */}

          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-100
              bg-white
              text-[#4B517D]
              shadow-sm
              transition
              active:scale-95
            "
          >
            <ArrowLeft size={16} />
          </button>

          {/* Class Selector */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-[18px]
                border
                border-slate-100
                bg-white
                px-4
                shadow-sm
                transition
                active:scale-[0.98]
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#F59A23]" />

              <span className="text-[13px] font-bold text-slate-800">
                {selectedClass || "Select Class"}
              </span>

              <ChevronDown
                size={16}
                className={`
                  text-slate-500
                  transition-transform
                  duration-200
                  ${showDropdown ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Class Dropdown */}

            {showDropdown && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-50
                  w-[180px]
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-slate-200
                  bg-white
                  p-2
                  shadow-[0_18px_45px_rgba(75,81,125,0.16)]
                "
              >
                {classes.map((cls) => {
                  const selected = selectedClass === cls.name;

                  return (
                    <button
                      type="button"
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls.name);
                        setShowDropdown(false);
                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-2xl
                        px-4
                        py-3
                        text-left
                        transition-all
                        ${
                          selected
                            ? "bg-[#4B517D] text-white shadow-sm"
                            : "text-slate-700 hover:bg-[#FFF8EC]"
                        }
                      `}
                    >
                      <span className="text-sm font-semibold">{cls.name}</span>

                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-[#F59A23]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= TITLE ================= */}

        <div className="mt-5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Assignments
            </h1>

            <Image
              src="/studAssignment.png"
              alt="Assignments"
              width={21}
              height={21}
              className="object-contain"
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Create and evaluate assignments
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}

        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* Total */}

          <div
            className="
              rounded-[20px]
              border
              border-[#DCE4F5]
              bg-[#EEF4FF]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-500">
                Total Assignments
              </p>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-white/80
                  text-[#4B517D]
                "
              >
                <ClipboardList size={14} />
              </div>
            </div>

            <h3 className="mt-2 text-[30px] font-extrabold leading-none text-[#4B517D]">
              {assignments.length}
            </h3>
          </div>

          {/* Active */}

          <div
            className="
              rounded-[20px]
              border
              border-[#F7DFC0]
              bg-[#FFF4E8]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-500">Active</p>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-white/80
                  text-[#F59A23]
                "
              >
                <CalendarDays size={14} />
              </div>
            </div>

            <p className="mt-2 text-[30px] font-extrabold leading-none text-[#F59A23]">
              {activeAssignments}
            </p>
          </div>
        </div>

        {/* ================= CREATE ASSIGNMENT ================= */}

        <div className="mt-5">
          <button
            type="button"
            onClick={() => router.push("/teacher/mobile/assignments/create")}
            className="
              flex
              h-[52px]
              w-full
              items-center
              justify-center
              rounded-[19px]
              bg-gradient-to-r
              from-[#4B517D]
              to-[#626991]
              text-sm
              font-bold
              text-white
              shadow-[0_12px_28px_rgba(75,81,125,0.22)]
              transition-all
              duration-200
              active:scale-[0.98]
            "
          >
            + Create Assignment
          </button>
        </div>
      </div>

      {/* ================= ASSIGNMENT LIST ================= */}

      <div className="mt-6 space-y-4 px-4">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div
              className="
                h-9
                w-9
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-[#4B517D]
              "
            />

            <p className="mt-4 text-sm text-slate-400">
              Loading assignments...
            </p>
          </div>
        ) : assignments.length > 0 ? (
          assignments.map((item) => (
            <div
              key={item.id}
              className="
                relative
                overflow-visible
                rounded-[24px]
                border
                border-slate-100
                bg-white
                p-4
                shadow-[0_6px_22px_rgba(75,81,125,0.06)]
              "
            >
              {/* Assignment Header */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[17px] font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                    {item.lesson?.subject?.name || "Subject"}
                    {" • "}
                    {item.description || "No description provided"}
                  </p>
                </div>

                {/* Action Button */}

                <button
                  type="button"
                  onClick={() => openActionSheet(item)}
                  aria-label="Assignment actions"
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#F4F5F8]
                    text-slate-500
                    transition
                    hover:bg-[#EEF0F6]
                    hover:text-[#4B517D]
                    active:scale-95
                  "
                >
                  <MoreVertical size={17} />
                </button>
              </div>

              {/* Assignment Footer */}

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Due Date
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-[#4B517D]" />

                    <p className="text-sm font-semibold text-slate-800">
                      {formatDate(item.dueDate)}
                    </p>
                  </div>
                </div>

                {/* Marks */}

                <div
                  className="
                    rounded-full
                    border
                    border-[#F2DFC4]
                    bg-[#FFF8EC]
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-[#B87938]
                  "
                >
                  {item.totalMarks} Marks
                </div>
              </div>
            </div>
          ))
        ) : (
          /* ================= EMPTY STATE ================= */

          <div className="flex flex-col items-center pt-20">
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#EEF1F7]
              "
            >
              <Image
                src="/assignment.png"
                alt="No Assignments"
                width={42}
                height={42}
                className="object-contain"
              />
            </div>

            <h3 className="mt-5 text-[16px] font-bold text-slate-700">
              No Assignments
            </h3>

            <p className="mt-2 text-center text-[12px] leading-5 text-slate-400">
              No assignments available for this class
            </p>
          </div>
        )}
      </div>

      {/* ================= ACTION SHEET ================= */}

      {showActionSheet && selectedAssignment && (
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

            {/* Compact Header */}

            <div className="relative border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 pr-9">
                {/* Assignment Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA]">
                  <ClipboardList size={19} className="text-[#4B517D]" />
                </div>

                {/* Assignment Details */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[14px] font-bold text-slate-900">
                      {selectedAssignment.title}
                    </h2>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2
                        py-0.5
                        text-[8px]
                        font-semibold
                        ${
                          getAssignmentStatus(selectedAssignment.dueDate)
                            .className
                        }
                      `}
                    >
                      {getAssignmentStatus(selectedAssignment.dueDate).label}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-400">
                    <span>
                      {selectedAssignment.lesson?.subject?.name || "Subject"}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span>Due {formatDate(selectedAssignment.dueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Close */}

              <button
                type="button"
                onClick={closeActionSheet}
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
              {/* View */}

              <button
                type="button"
                onClick={() => {
                  const assignmentId = selectedAssignment.id;

                  closeActionSheet();

                  router.push(`/teacher/mobile/assignments/${assignmentId}`);
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
                    View Assignment
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    View complete assignment details
                  </p>
                </div>
              </button>

              {/* Edit */}

              <button
                type="button"
                onClick={() => {
                  const assignmentId = selectedAssignment.id;

                  closeActionSheet();

                  router.push(
                    `/teacher/mobile/assignments/${assignmentId}/edit`,
                  );
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
                    Edit Assignment
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Update assignment information
                  </p>
                </div>
              </button>

              {/* Delete */}

              <button
                type="button"
                onClick={() => {
                  const assignmentId = selectedAssignment.id;

                  setShowActionSheet(false);
                  setDeleteId(assignmentId);
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
                    Delete Assignment
                  </p>

                  <p className="mt-0.5 text-[9px] text-red-400">
                    Permanently remove this assignment
                  </p>
                </div>
              </button>
            </div>

            {/* Cancel */}

            <button
              type="button"
              onClick={closeActionSheet}
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

      {/* ================= DELETE SHEET ================= */}

      {deleteId !== null && (
        <div className="fixed inset-0 z-[9999] flex items-end bg-black/40">
          <div
            className="
              w-full
              rounded-t-[30px]
              border-t
              border-slate-100
              bg-white
              p-6
              shadow-[0_-15px_50px_rgba(0,0,0,0.12)]
            "
          >
            {/* Icon */}

            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-500
              "
            >
              <Trash2 size={20} />
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-slate-900">
              Delete Assignment?
            </h3>

            <p className="mt-2 text-center text-sm leading-5 text-slate-500">
              This action cannot be undone. The assignment will be permanently
              removed.
            </p>

            <div className="mt-6 flex gap-3">
              {/* Cancel */}

              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="
                  flex-1
                  h-12
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  active:scale-[0.98]
                "
              >
                Cancel
              </button>

              {/* Delete */}

              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="
                  flex-1
                  h-12
                  rounded-2xl
                  bg-red-500
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_10px_24px_rgba(239,68,68,0.20)]
                  transition
                  hover:bg-red-600
                  active:scale-[0.98]
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
