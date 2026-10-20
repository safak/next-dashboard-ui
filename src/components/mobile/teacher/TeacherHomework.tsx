"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpenCheck,
  ChevronDown,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import SummaryCard from "@/components/admin/SummaryCard";

interface HomeworkItem {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subject?: {
    name: string;
  };
}

interface ClassItem {
  id: number;
  name: string;
}

export default function TeacherHomework() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(
    null,
  );

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

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
      const response = await fetch("/api/mobile/teacher/classes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }

      const data = await response.json();

      const classList = Array.isArray(data) ? data : [];

      setClasses(classList);

      if (classList.length > 0) {
        setSelectedClass(classList[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    }
  };

  /* ================= FETCH HOMEWORK ================= */

  const fetchHomework = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/mobile/teacher/homework?className=${encodeURIComponent(
          selectedClass,
        )}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch homework");
      }

      const data = await response.json();

      setHomework(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch homework:", error);
      setHomework([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      void fetchHomework();
    } else {
      setHomework([]);
      setLoading(false);
    }
  }, [selectedClass, fetchHomework]);

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/mobile/teacher/homework/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete homework");
      }

      setDeleteId(null);
      setSelectedHomework(null);

      toast.success("Homework deleted successfully");

      await fetchHomework();
    } catch (error) {
      console.error("Failed to delete homework:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete homework",
      );
    } finally {
      setDeleting(false);
    }
  };

  const upcomingCount = homework.filter(
    (item) => new Date(item.dueDate) > new Date(),
  ).length;

  const getHomeworkStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const dueDateOnly = new Date(
      due.getFullYear(),
      due.getMonth(),
      due.getDate(),
    );

    if (dueDateOnly < todayDate) {
      return {
        label: "Overdue",
        className: "bg-red-100 text-red-700",
      };
    }

    if (dueDateOnly.getTime() === todayDate.getTime()) {
      return {
        label: "Due Today",
        className: "bg-green-100 text-green-700",
      };
    }

    return {
      label: "Pending",
      className: "bg-[#FFF4E5] text-[#C46D08]",
    };
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));
  };

  const closeActionSheet = () => {
    setShowActionSheet(false);
    setSelectedHomework(null);
  };

  const openView = () => {
    if (!selectedHomework) {
      return;
    }

    const id = selectedHomework.id;

    closeActionSheet();

    router.push(`/teacher/mobile/homework/${id}`);
  };

  const openEdit = () => {
    if (!selectedHomework) {
      return;
    }

    const id = selectedHomework.id;

    closeActionSheet();

    router.push(`/teacher/mobile/homework/edit/${id}`);
  };

  const openDeleteConfirmation = () => {
    if (!selectedHomework) {
      return;
    }

    const id = selectedHomework.id;

    closeActionSheet();

    setDeleteId(id);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] pb-10">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between">
          {/* BACK */}

          <button
            type="button"
            onClick={() => router.back()}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-100
              bg-white
              text-[#4B517D]
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft size={18} />
          </button>

          {/* CLASS SELECTOR */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown((previous) => !previous)}
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-[18px]
                border
                border-slate-100
                bg-white
                px-4
                shadow-[0_8px_24px_rgba(15,23,42,0.06)]
                transition
                active:scale-95
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#626991]" />

              <span className="max-w-[130px] truncate text-[13px] font-bold text-slate-800">
                {selectedClass || "Select Class"}
              </span>

              <ChevronDown
                size={16}
                className={`
                  text-slate-400
                  transition-transform
                  duration-300
                  ${showDropdown ? "rotate-180" : ""}
                `}
              />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />

                <div
                  className="
                    absolute
                    right-0
                    top-14
                    z-50
                    w-[180px]
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-slate-100
                    bg-white
                    p-1.5
                    shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                  "
                >
                  {classes.map((cls) => {
                    const active = selectedClass === cls.name;

                    return (
                      <button
                        key={cls.id}
                        type="button"
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
                          transition
                          ${
                            active
                              ? "bg-[#4B517D] text-white"
                              : "text-slate-700 hover:bg-[#F8FAFC]"
                          }
                        `}
                      >
                        <span className="text-sm font-semibold">
                          {cls.name}
                        </span>

                        {active && (
                          <span className="h-2 w-2 rounded-full bg-[#F59A23]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-7">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-extrabold leading-none text-slate-900">
              Homework
            </h1>

            <Image
              src="/homework.png"
              alt="Homework"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>

          <p className="mt-3 text-[13px] text-slate-400">
            Class homework assignments
          </p>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mt-6 px-5">
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Total Homework"
            value={homework.length}
            icon={BookOpenCheck}
            color="blue"
            compact
          />

          <SummaryCard
            title="Upcoming"
            value={upcomingCount}
            icon={BookOpenCheck}
            color="yellow"
            compact
          />
        </div>
      </div>

      {/* ================= CREATE HOMEWORK ================= */}

      <div className="mt-4 px-5">
        <button
          type="button"
          onClick={() => router.push("/teacher/mobile/homework/create")}
          className="
            flex
            h-[50px]
            w-full
            items-center
            justify-center
            rounded-[18px]
            bg-gradient-to-r
            from-[#4B517D]
            to-[#626991]
            text-[14px]
            font-semibold
            text-white
            shadow-[0_12px_30px_rgba(75,81,125,0.22)]
            transition
            active:scale-[0.98]
          "
        >
          + Create Homework
        </button>
      </div>

      {/* ================= HOMEWORK LIST ================= */}

      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-slate-900">Homework</h2>

            <p className="mt-1 text-[12px] text-slate-400">
              Assigned class homework
            </p>
          </div>

          <span className="text-[12px] font-semibold text-[#4B517D]">
            {homework.length} Records
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="py-10 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#4B517D]" />

              <p className="mt-3 text-xs text-slate-400">Loading homework...</p>
            </div>
          ) : homework.length === 0 ? (
            <div
              className="
                rounded-[24px]
                border
                border-slate-100
                bg-white
                px-4
                py-8
                text-center
                shadow-[0_8px_20px_rgba(15,23,42,0.05)]
              "
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F3F8]">
                <Image
                  src="/homework.png"
                  alt="No Homework"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>

              <h3 className="mt-4 text-[17px] font-bold text-slate-800">
                No Homework Assigned
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-slate-400">
                No homework available for this class.
              </p>
            </div>
          ) : (
            homework.map((item) => {
              const status = getHomeworkStatus(item.dueDate);

              return (
                <div
                  key={item.id}
                  className="
                    rounded-[22px]
                    border
                    border-slate-100
                    bg-white
                    px-4
                    py-3
                    shadow-[0_8px_20px_rgba(15,23,42,0.05)]
                  "
                >
                  {/* HEADER */}

                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-[#EEF2FA]
                        "
                      >
                        <BookOpenCheck size={20} className="text-[#4B517D]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-0.5 truncate text-[12px] text-slate-400">
                          {item.subject?.name || "Subject"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION MENU */}

                    <div className="ml-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHomework(item);
                          setShowActionSheet(true);
                        }}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          text-slate-500
                          transition
                          active:bg-slate-100
                          active:scale-95
                        "
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  {item.description && (
                    <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-slate-500">
                      {item.description}
                    </p>
                  )}

                  {/* FOOTER */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-100
                      pt-3
                    "
                  >
                    <div className="text-[12px] font-medium text-slate-500">
                      📅 {formatDate(item.dueDate)}
                    </div>

                    <div
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        ${status.className}
                      `}
                    >
                      {status.label}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= BOTTOM SPACING ================= */}

      <div className="h-24" />

      {/* ================= DELETE CONFIRMATION ================= */}

      {deleteId !== null && (
        <div
          className="
            fixed
            inset-0
            z-[80]
            flex
            items-end
            bg-black/40
          "
          onClick={() => {
            if (!deleting) {
              setDeleteId(null);
            }
          }}
        >
          <div
            className="
              w-full
              rounded-t-[32px]
              bg-white
              px-6
              pb-8
              pt-5
              shadow-[0_-12px_40px_rgba(15,23,42,0.16)]
              animate-slide-up
            "
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={24} className="text-red-500" />
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-slate-900">
              Delete Homework?
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete this homework?
              <br />
              This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
                className="
                  h-12
                  flex-1
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  font-semibold
                  text-slate-700
                  transition
                  active:scale-[0.98]
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteId)}
                className="
                  h-12
                  flex-1
                  rounded-2xl
                  bg-red-500
                  font-semibold
                  text-white
                  shadow-[0_10px_25px_rgba(239,68,68,0.20)]
                  transition
                  active:scale-[0.98]
                  disabled:opacity-60
                "
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HOMEWORK BOTTOM ACTION SHEET ================= */}

      {showActionSheet && selectedHomework && (
        <div
          className="fixed inset-0 z-[90] flex items-end bg-black/40"
          onClick={closeActionSheet}
        >
          <div
            className="
        w-full
        rounded-t-[28px]
        bg-white
        px-4
        pb-5
        pt-3
        shadow-[0_-10px_30px_rgba(15,23,42,0.15)]
      "
            onClick={(event) => event.stopPropagation()}
          >
            {/* Handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />

            {/* ================= HOMEWORK HEADER ================= */}

            <div className="relative border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 pr-9">
                {/* Homework Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA]">
                  <BookOpenCheck size={19} className="text-[#4B517D]" />
                </div>

                {/* Homework Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[14px] font-bold text-slate-900">
                      {selectedHomework.title}
                    </h2>

                    <span
                      className={`
            shrink-0
            rounded-full
            px-2
            py-0.5
            text-[8px]
            font-semibold
            ${getHomeworkStatus(selectedHomework.dueDate).className}
          `}
                    >
                      {getHomeworkStatus(selectedHomework.dueDate).label}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-400">
                    <span>{selectedHomework.subject?.name || "Subject"}</span>

                    <span className="text-slate-300">•</span>

                    <span>Due {formatDate(selectedHomework.dueDate)}</span>
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

            {/* ================= ACTIONS ================= */}

            <div className="pt-2">
              {/* View */}
              <button
                type="button"
                onClick={openView}
                className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            active:bg-slate-50
          "
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA]">
                  <Eye size={17} className="text-[#4B517D]" />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-slate-800">
                    View Homework
                  </p>

                  <p className="text-[9px] text-slate-400">
                    View complete homework details
                  </p>
                </div>
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={openEdit}
                className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            active:bg-slate-50
          "
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF4E5]">
                  <Pencil size={17} className="text-[#F59A23]" />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-slate-800">
                    Edit Homework
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Update homework information
                  </p>
                </div>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={openDeleteConfirmation}
                className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-left
            active:bg-red-50
          "
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <Trash2 size={17} className="text-red-500" />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-red-600">
                    Delete Homework
                  </p>

                  <p className="text-[9px] text-red-400">
                    Permanently remove this homework
                  </p>
                </div>
              </button>
            </div>

            {/* ================= CANCEL ================= */}

            <button
              type="button"
              onClick={closeActionSheet}
              className="
          mt-2
          h-10
          w-full
          rounded-xl
          bg-[#F1F4F8]
          text-[12px]
          font-semibold
          text-slate-700
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
