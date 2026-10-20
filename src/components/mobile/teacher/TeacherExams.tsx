"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

interface Exam {
  id: number;
  title: string;
  description?: string;
  totalMarks: number;
  examDate: string;
  class?: {
    name: string;
  };
  subject?: {
    name: string;
  };
}

interface ClassItem {
  id: number;
  name: string;
}

export default function TeacherExams() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchExams();
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
      const response = await fetch("/api/mobile/teacher/classes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: ${response.status}`);
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

  const fetchExams = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/mobile/teacher/exams", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.status}`);
      }

      const data = await response.json();

      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/mobile/teacher/exams/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete exam");
      }

      setDeleteId(null);
      setSelectedExam(null);

      toast.success("Exam deleted successfully");

      await fetchExams();
    } catch (error) {
      console.error("Delete exam error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete exam",
      );
    } finally {
      setDeleting(false);
    }
  };

  const today = new Date();

  const upcomingCount = exams.filter(
    (exam) => new Date(exam.examDate) >= today,
  ).length;

  const closeActionSheet = () => {
    setShowActionSheet(false);
    setSelectedExam(null);
  };

  const openView = () => {
    if (!selectedExam) {
      return;
    }

    const id = selectedExam.id;

    closeActionSheet();

    router.push(`/teacher/mobile/exams/${id}`);
  };

  const openEdit = () => {
    if (!selectedExam) {
      return;
    }

    const id = selectedExam.id;

    closeActionSheet();

    router.push(`/teacher/mobile/exams/${id}/edit`);
  };

  const openDeleteConfirmation = () => {
    if (!selectedExam) {
      return;
    }

    const id = selectedExam.id;

    closeActionSheet();

    setDeleteId(id);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));
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
            aria-label="Go back"
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
                  {classes.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400">
                      No classes available
                    </div>
                  ) : (
                    classes.map((cls) => {
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
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-7">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-extrabold leading-none text-slate-900">
              Exams
            </h1>

            <Image
              src="/exam.png"
              alt="Exams"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>

          <p className="mt-3 text-[13px] text-slate-400">
            View and evaluate exams assigned to your classes.
          </p>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mt-6 px-5">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="
              rounded-[22px]
              border
              border-[#DDE4F2]
              bg-[#EEF2F9]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-slate-500">
                Total Exams
              </p>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#4B517D]
                  shadow-sm
                "
              >
                <span className="text-xs font-bold">E</span>
              </div>
            </div>

            <h2 className="mt-2 text-[30px] font-bold leading-none text-[#4B517D]">
              {exams.length}
            </h2>
          </div>

          <div
            className="
              rounded-[22px]
              border
              border-[#F6DFC0]
              bg-[#FFF8EC]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-slate-500">Upcoming</p>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#F59A23]
                  shadow-sm
                "
              >
                <CalendarDays size={14} />
              </div>
            </div>

            <h2 className="mt-2 text-[30px] font-bold leading-none text-[#F59A23]">
              {upcomingCount}
            </h2>
          </div>
        </div>
      </div>

      {/* ================= EXAM LIST ================= */}

      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-slate-900">Exams</h2>

            <p className="mt-1 text-[12px] text-slate-400">
              Scheduled class exams
            </p>
          </div>

          <span className="text-[12px] font-semibold text-[#4B517D]">
            {exams.length} Records
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-[130px]
                    animate-pulse
                    rounded-[24px]
                    bg-white
                  "
                />
              ))}
            </div>
          ) : exams.length === 0 ? (
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2F9]">
                <Image
                  src="/exam.png"
                  alt="No Exams"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>

              <h3 className="mt-4 text-[17px] font-bold text-slate-800">
                No Exams Found
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-slate-400">
                Exams created by the administrator will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-10">
              {exams.map((exam) => {
                const isUpcoming = new Date(exam.examDate) >= today;

                return (
                  <div
                    key={exam.id}
                    className="
                      relative
                      rounded-[22px]
                      border
                      border-slate-100
                      bg-white
                      px-4
                      py-3
                      shadow-[0_8px_20px_rgba(15,23,42,0.05)]
                      transition
                    "
                  >
                    {/* Accent */}

                    <div
                      className={`
                        absolute
                        left-0
                        top-5
                        h-10
                        w-1
                        rounded-r-full
                        ${isUpcoming ? "bg-[#F59A23]" : "bg-[#4B517D]"}
                      `}
                    />

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
                          <Image
                            src="/exam.png"
                            alt="Exam"
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-bold text-slate-900">
                            {exam.title}
                          </h3>

                          <p className="mt-0.5 truncate text-[12px] text-slate-400">
                            {exam.subject?.name || "Subject"}
                          </p>
                        </div>
                      </div>

                      {/* ACTION */}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExam(exam);
                          setShowActionSheet(true);
                        }}
                        aria-label="Exam actions"
                        className="
                          ml-2
                          flex
                          h-9
                          w-9
                          shrink-0
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

                    {/* FOOTER */}

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-slate-100
                        pt-3
                      "
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#EEF2F9]
                            text-[#4B517D]
                          "
                        >
                          <CalendarDays size={14} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] text-slate-400">Exam Date</p>

                          <p className="text-xs font-semibold text-slate-700">
                            {formatDate(exam.examDate)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-3
                          py-1.5
                          text-[10px]
                          font-bold
                          ${
                            isUpcoming
                              ? "bg-[#FFF8EC] text-[#C87912]"
                              : "bg-[#EEF2F9] text-[#4B517D]"
                          }
                        `}
                      >
                        {isUpcoming ? "Upcoming" : "Completed"}
                      </span>
                    </div>

                    {/* MARKS */}

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
                      <span className="text-[10px] text-slate-400">
                        Total Marks
                      </span>

                      <span className="text-xs font-bold text-[#4B517D]">
                        {exam.totalMarks} Marks
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
            z-[100]
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
              Delete Exam?
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete this exam?
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

      {/* ================= EXAM BOTTOM ACTION SHEET ================= */}

      {showActionSheet && selectedExam && (
        <div
          className="
            fixed
            inset-0
            z-[90]
            flex
            items-end
            bg-black/40
          "
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
            {/* HANDLE */}

            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />

            {/* ================= EXAM HEADER ================= */}

            <div className="relative border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 pr-9">
                {/* EXAM ICON */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA]">
                  <Image
                    src="/exam.png"
                    alt="Exam"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>

                {/* EXAM DETAILS */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[14px] font-bold text-slate-900">
                      {selectedExam.title}
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
                          new Date(selectedExam.examDate) >= today
                            ? "bg-[#FFF4E5] text-[#C46D08]"
                            : "bg-[#EEF2FA] text-[#4B517D]"
                        }
                      `}
                    >
                      {new Date(selectedExam.examDate) >= today
                        ? "Upcoming"
                        : "Completed"}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-400">
                    <span>{selectedExam.subject?.name || "Subject"}</span>

                    <span className="text-slate-300">•</span>

                    <span>{selectedExam.class?.name || "Class"}</span>

                    <span className="text-slate-300">•</span>

                    <span>{formatDate(selectedExam.examDate)}</span>
                  </div>
                </div>
              </div>

              {/* CLOSE */}

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
              {/* VIEW */}

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
                    View Exam
                  </p>

                  <p className="text-[9px] text-slate-400">
                    View complete exam details
                  </p>
                </div>
              </button>

              {/* EDIT */}

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
                    Edit Exam
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Update exam information
                  </p>
                </div>
              </button>

              {/* DELETE */}

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
                    Delete Exam
                  </p>

                  <p className="text-[9px] text-red-400">
                    Permanently remove this exam
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
