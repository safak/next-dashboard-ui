"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassItem {
  id: number;
  name: string;
}

interface ExamItem {
  id: number;
  title: string;
  totalMarks: number;
  examDate: string;
  subject: {
    name: string;
  };
}

export default function ExamResultReport() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  const [loadingType, setLoadingType] = useState<"pdf" | "excel" | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

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

  const fetchExams = useCallback(async () => {
    try {
      setSelectedExam(null);

      const response = await fetch(
        `/api/mobile/teacher/exams?className=${encodeURIComponent(
          selectedClass,
        )}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        setExams([]);
        return;
      }

      const data = await response.json();
      const examList = Array.isArray(data) ? data : [];

      setExams(examList);

      if (examList.length > 0) {
        setSelectedExam(examList[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
      setExams([]);
      setSelectedExam(null);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      void fetchExams();
    } else {
      setExams([]);
      setSelectedExam(null);
    }
  }, [selectedClass, fetchExams]);

  const downloadReport = async (format: "pdf" | "excel") => {
    if (!selectedExam) {
      alert("Please select an exam");
      return;
    }

    try {
      setLoadingType(format);

      const response = await fetch("/api/mobile/teacher/reports/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: selectedClass,
          examId: selectedExam,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const exam = exams.find((item) => item.id === selectedExam);

      const safeExamTitle = (exam?.title || "Exam")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim();

      link.download =
        format === "pdf"
          ? `${selectedClass}_${safeExamTitle}_Result.pdf`
          : `${selectedClass}_${safeExamTitle}_Result.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate report");
    } finally {
      setLoadingType(null);
    }
  };

  const selectedExamDetails = exams.find((exam) => exam.id === selectedExam);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          {/* Back */}

          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="
              flex
              h-10
              w-10
              shrink-0
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
            <ArrowLeft size={18} />
          </button>

          {/* Class Selector */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowClassDropdown((prev) => !prev)}
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-3.5
                shadow-[0_8px_24px_rgba(15,23,42,0.06)]
                transition
                active:scale-[0.98]
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#F59A23]" />

              <span className="max-w-[100px] truncate text-[12px] font-bold text-slate-800">
                {selectedClass || "Select Class"}
              </span>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  showClassDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showClassDropdown && (
              <>
                <button
                  type="button"
                  aria-label="Close class selector"
                  onClick={() => setShowClassDropdown(false)}
                  className="fixed inset-0 z-40 h-full w-full"
                />

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
                    border-slate-100
                    bg-white
                    p-2
                    shadow-[0_20px_50px_rgba(15,23,42,0.14)]
                  "
                >
                  {classes.length === 0 ? (
                    <div className="px-4 py-4 text-center text-xs text-slate-400">
                      No classes available
                    </div>
                  ) : (
                    classes.map((cls) => {
                      const selected = selectedClass === cls.name;

                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => {
                            setSelectedClass(cls.name);
                            setShowClassDropdown(false);
                          }}
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3
                            py-2.5
                            text-left
                            transition
                            ${
                              selected
                                ? "bg-[#4B517D] text-white"
                                : "text-slate-700 hover:bg-[#F7F8FA]"
                            }
                          `}
                        >
                          <span className="text-[12px] font-semibold">
                            {cls.name}
                          </span>

                          {selected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F59A23]" />
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

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900">
              Exam Result Report
            </h1>

            <span className="text-[20px]">📊</span>
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            View and download exam performance results
          </p>
        </div>
      </div>

      {/* ================= REPORT CARD ================= */}

      <div className="mt-5 px-4">
        <div
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-slate-100
            bg-white
            shadow-[0_10px_30px_rgba(15,23,42,0.05)]
          "
        >
          {/* CARD HEADER */}

          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-[#4B517D]
              via-[#555B86]
              to-[#626991]
              px-5
              py-5
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-[#F59A23]/90
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-12
                right-10
                h-24
                w-24
                rounded-full
                bg-white/5
              "
            />

            <div className="relative z-10 flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/15
                  text-white
                  backdrop-blur-sm
                "
              >
                <FileText size={21} />
              </div>

              <div>
                <p className="text-[10px] font-medium text-white/65">
                  Examination Results
                </p>

                <p className="mt-0.5 text-[15px] font-bold text-white">
                  {selectedClass || "Select Class"}
                </p>
              </div>
            </div>
          </div>

          {/* CARD CONTENT */}

          <div className="p-5">
            {/* CLASS */}

            <div>
              <label className="text-[11px] font-semibold text-slate-500">
                Assigned Class
              </label>

              <div
                className="
                  mt-2
                  flex
                  h-[50px]
                  items-center
                  rounded-[17px]
                  border
                  border-slate-200
                  bg-[#F5F7FA]
                  px-4
                  text-[13px]
                  font-semibold
                  text-slate-800
                "
              >
                <span className="mr-2">🏫</span>

                {selectedClass || "Loading..."}
              </div>
            </div>

            {/* EXAM */}

            <div className="mt-5">
              <label className="text-[11px] font-semibold text-slate-500">
                Select Exam
              </label>

              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setShowExamDropdown((prev) => !prev)}
                  className="
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-between
                    rounded-[17px]
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-left
                    transition
                    active:scale-[0.99]
                  "
                >
                  <span
                    className={`truncate text-[13px] font-semibold ${
                      selectedExamDetails ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {selectedExamDetails
                      ? selectedExamDetails.title
                      : "Select Exam"}
                  </span>

                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-slate-400 transition-transform ${
                      showExamDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showExamDropdown && (
                  <>
                    <button
                      type="button"
                      aria-label="Close exam selector"
                      onClick={() => setShowExamDropdown(false)}
                      className="fixed inset-0 z-40 h-full w-full"
                    />

                    <div
                      className="
                        absolute
                        left-0
                        top-[56px]
                        z-50
                        max-h-64
                        w-full
                        overflow-y-auto
                        rounded-[20px]
                        border
                        border-slate-100
                        bg-white
                        p-2
                        shadow-[0_20px_50px_rgba(15,23,42,0.14)]
                      "
                    >
                      {exams.length === 0 ? (
                        <div className="px-4 py-5 text-center text-xs text-slate-400">
                          No exams found for this class
                        </div>
                      ) : (
                        exams.map((exam) => {
                          const selected = selectedExam === exam.id;

                          return (
                            <button
                              key={exam.id}
                              type="button"
                              onClick={() => {
                                setSelectedExam(exam.id);
                                setShowExamDropdown(false);
                              }}
                              className={`
                                w-full
                                rounded-xl
                                px-3
                                py-3
                                text-left
                                transition
                                ${
                                  selected
                                    ? "bg-[#4B517D] text-white"
                                    : "text-slate-700 hover:bg-[#F7F8FA]"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-bold">
                                    {exam.title}
                                  </p>

                                  <p
                                    className={`mt-1 text-[10px] ${
                                      selected
                                        ? "text-white/70"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {exam.subject.name} • {exam.totalMarks}{" "}
                                    Marks
                                  </p>
                                </div>

                                {selected && (
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59A23]" />
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SUMMARY */}

            {selectedExamDetails && (
              <div
                className="
                  mt-5
                  rounded-[20px]
                  border
                  border-[#E7E9F0]
                  bg-[#F8F9FB]
                  p-4
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FFF8EC]
                      text-[#F59A23]
                    "
                  >
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                      Selected Examination
                    </p>

                    <p className="mt-0.5 text-[13px] font-bold text-[#4B517D]">
                      {selectedExamDetails.title}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div
                    className="
                      rounded-[16px]
                      border
                      border-slate-100
                      bg-white
                      px-3
                      py-3
                    "
                  >
                    <p className="text-[9px] font-medium text-slate-400">
                      Subject
                    </p>

                    <p className="mt-1 truncate text-[12px] font-bold text-slate-800">
                      {selectedExamDetails.subject.name}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-[16px]
                      border
                      border-slate-100
                      bg-white
                      px-3
                      py-3
                    "
                  >
                    <p className="text-[9px] font-medium text-slate-400">
                      Total Marks
                    </p>

                    <p className="mt-1 text-[12px] font-bold text-slate-800">
                      {selectedExamDetails.totalMarks}
                    </p>
                  </div>

                  <div
                    className="
                      col-span-2
                      rounded-[16px]
                      border
                      border-slate-100
                      bg-white
                      px-3
                      py-3
                    "
                  >
                    <p className="text-[9px] font-medium text-slate-400">
                      Exam Date
                    </p>

                    <p className="mt-1 text-[12px] font-bold text-slate-800">
                      {new Date(
                        selectedExamDetails.examDate,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DOWNLOAD */}

            <div className="mt-5 space-y-3">
              <button
                type="button"
                disabled={loadingType !== null || !selectedExam}
                onClick={() => downloadReport("pdf")}
                className={`
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[18px]
                  text-[13px]
                  font-bold
                  transition-all
                  active:scale-[0.98]
                  ${
                    loadingType === "pdf" || !selectedExam
                      ? "bg-slate-200 text-slate-400"
                      : "bg-[#4B517D] text-white shadow-[0_10px_24px_rgba(75,81,125,0.20)]"
                  }
                `}
              >
                <FileText size={18} />

                {loadingType === "pdf" ? "Generating PDF..." : "Download PDF"}
              </button>

              <button
                type="button"
                disabled={loadingType !== null || !selectedExam}
                onClick={() => downloadReport("excel")}
                className={`
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[18px]
                  text-[13px]
                  font-bold
                  transition-all
                  active:scale-[0.98]
                  ${
                    loadingType === "excel" || !selectedExam
                      ? "bg-slate-200 text-slate-400"
                      : "border border-[#E5E7EC] bg-[#FFF8EC] text-[#B87316] shadow-sm"
                  }
                `}
              >
                <FileSpreadsheet size={18} />

                {loadingType === "excel"
                  ? "Generating Excel..."
                  : "Download Excel"}
              </button>
            </div>

            {/* LOADING */}

            {loadingType && (
              <div className="mt-5 flex flex-col items-center justify-center gap-2">
                <div
                  className="
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-4
                    border-[#E4E7F2]
                    border-t-[#4B517D]
                  "
                />

                <p className="text-[11px] font-semibold text-[#4B517D]">
                  Generating {loadingType === "pdf" ? "PDF" : "Excel"} report...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}
