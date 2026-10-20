"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
} from "lucide-react";
import { useMemo, useState } from "react";

type ExamItem = {
  id: number;
  title: string;
  description: string;
  totalMarks: number;
  examDate: string;

  subject: {
    id: number;
    name: string;
  };

  teacher: {
    name: string;
    surname: string;
  };

  evaluation: {
    id: number;
    obtainedMarks: number;
    remark: string | null;
    createdAt: string;
  } | null;
};

type Props = {
  exams: ExamItem[];
};

type Filter =
  | "ALL"
  | "UPCOMING"
  | "RESULTS";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function formatExamDay(value: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    },
  ).format(new Date(value));
}

function isUpcoming(
  examDate: string,
) {
  return new Date(examDate).getTime() >=
    new Date().getTime();
}

function getDaysText(
  examDate: string,
) {
  const today = new Date();

  const exam = new Date(examDate);

  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);

  const difference =
    exam.getTime() - today.getTime();

  const days = Math.round(
    difference /
      (1000 * 60 * 60 * 24),
  );

  if (days < 0) {
    return "Exam completed";
  }

  if (days === 0) {
    return "Exam today";
  }

  if (days === 1) {
    return "Tomorrow";
  }

  return `In ${days} days`;
}

export default function ParentExamsClient({
  exams,
}: Props) {
  const [filter, setFilter] =
    useState<Filter>("ALL");

  const [
    selectedExam,
    setSelectedExam,
  ] = useState<ExamItem | null>(
    null,
  );

  const counts = useMemo(() => {
    return {
      all: exams.length,

      upcoming: exams.filter(
        (exam) =>
          isUpcoming(exam.examDate),
      ).length,

      results: exams.filter(
        (exam) =>
          exam.evaluation !== null,
      ).length,
    };
  }, [exams]);

  const filteredExams =
    useMemo(() => {
      if (filter === "ALL") {
        return exams;
      }

      if (filter === "UPCOMING") {
        return exams.filter((exam) =>
          isUpcoming(
            exam.examDate,
          ),
        );
      }

      return exams.filter(
        (exam) =>
          exam.evaluation !== null,
      );
    }, [exams, filter]);

  return (
    <>
      {/* ================= SUMMARY ================= */}

      <section className="mt-6 grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() =>
            setFilter("ALL")
          }
          className={`
            rounded-[18px]
            border
            px-3
            py-3
            text-left
            transition
            active:scale-[0.98]
            ${
              filter === "ALL"
                ? "border-[#4B517D]/20 bg-[#4B517D] text-white shadow-sm"
                : "border-slate-100 bg-white text-slate-700"
            }
          `}
        >
          <p
            className={`text-[9px] ${
              filter === "ALL"
                ? "text-white/70"
                : "text-slate-400"
            }`}
          >
            Total
          </p>

          <p className="mt-1 text-[21px] font-extrabold">
            {counts.all}
          </p>

          <p
            className={`mt-0.5 text-[8px] ${
              filter === "ALL"
                ? "text-white/60"
                : "text-slate-400"
            }`}
          >
            Exams
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("UPCOMING")
          }
          className={`
            rounded-[18px]
            border
            px-3
            py-3
            text-left
            transition
            active:scale-[0.98]
            ${
              filter === "UPCOMING"
                ? "border-[#F59A23]/20 bg-[#FFF0D6]"
                : "border-slate-100 bg-white"
            }
          `}
        >
          <p className="text-[9px] text-slate-400">
            Upcoming
          </p>

          <p className="mt-1 text-[21px] font-extrabold text-[#B87938]">
            {counts.upcoming}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Scheduled
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("RESULTS")
          }
          className={`
            rounded-[18px]
            border
            px-3
            py-3
            text-left
            transition
            active:scale-[0.98]
            ${
              filter === "RESULTS"
                ? "border-emerald-100 bg-emerald-50"
                : "border-slate-100 bg-white"
            }
          `}
        >
          <p className="text-[9px] text-slate-400">
            Results
          </p>

          <p className="mt-1 text-[21px] font-extrabold text-emerald-600">
            {counts.results}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Published
          </p>
        </button>
      </section>

      {/* ================= LIST HEADER ================= */}

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-[#4B517D]">
            Exams
          </h2>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {filteredExams.length}{" "}
            {filteredExams.length === 1
              ? "exam"
              : "exams"}
          </p>
        </div>
      </div>

      {/* ================= EXAM LIST ================= */}

      <section className="mt-3 space-y-3">
        {filteredExams.length ===
        0 ? (
          <div
            className="
              rounded-[22px]
              border
              border-slate-100
              bg-white
              px-5
              py-12
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-[20px]
                bg-[#EEF2FA]
                text-[#4B517D]
              "
            >
              <FileCheck2 className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#4B517D]">
              No exams found
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              There are no exams in this category.
            </p>
          </div>
        ) : (
          filteredExams.map(
            (exam) => {
              const upcoming =
                isUpcoming(
                  exam.examDate,
                );

              const hasResult =
                exam.evaluation !== null;

              return (
                <button
                  type="button"
                  key={exam.id}
                  onClick={() =>
                    setSelectedExam(
                      exam,
                    )
                  }
                  className="
                    group
                    w-full
                    rounded-[22px]
                    border
                    border-slate-100
                    bg-white
                    p-3.5
                    text-left
                    shadow-[0_5px_18px_rgba(15,23,42,0.05)]
                    transition
                    active:scale-[0.99]
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[16px]
                        ${
                          hasResult
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[#E7ECF8] text-[#4B517D]"
                        }
                      `}
                    >
                      {hasResult ? (
                        <CheckCircle2
                          className="h-5 w-5"
                          strokeWidth={1.9}
                        />
                      ) : (
                        <FileCheck2
                          className="h-5 w-5"
                          strokeWidth={1.9}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                            {
                              exam.subject
                                .name
                            }
                          </p>

                          <h3 className="mt-0.5 truncate text-[14px] font-extrabold text-slate-900">
                            {exam.title}
                          </h3>
                        </div>

                        <span
                          className={`
                            shrink-0
                            rounded-full
                            px-2
                            py-1
                            text-[8px]
                            font-bold
                            ${
                              hasResult
                                ? "bg-emerald-100 text-emerald-700"
                                : upcoming
                                  ? "bg-[#FFF0D6] text-[#B87938]"
                                  : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          {hasResult
                            ? "Result"
                            : upcoming
                              ? "Upcoming"
                              : "Completed"}
                        </span>
                      </div>

                      <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
                        {exam.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-[9px] text-slate-400">
                          <CalendarDays className="h-3 w-3" />

                          {formatExamDay(
                            exam.examDate,
                          )}
                        </span>

                        <span
                          className={`
                            flex
                            items-center
                            gap-1
                            text-[9px]
                            font-semibold
                            ${
                              upcoming
                                ? "text-[#B87938]"
                                : "text-slate-400"
                            }
                          `}
                        >
                          <Clock3 className="h-3 w-3" />

                          {getDaysText(
                            exam.examDate,
                          )}
                        </span>

                        <span className="text-[9px] font-semibold text-slate-400">
                          {exam.totalMarks}{" "}
                          marks
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            },
          )
        )}
      </section>

      {/* ================= DETAILS SHEET ================= */}

      {selectedExam && (
        <>
          <button
            type="button"
            aria-label="Close exam details"
            onClick={() =>
              setSelectedExam(null)
            }
            className="
              fixed
              inset-0
              z-[80]
              bg-black/25
              backdrop-blur-[2px]
            "
          />

          <div
            className="
              fixed
              bottom-0
              left-1/2
              z-[90]
              w-full
              max-w-[430px]
              -translate-x-1/2
              rounded-t-[28px]
              bg-white
              px-5
              pb-7
              pt-3
              shadow-[0_-10px_40px_rgba(15,23,42,0.18)]
            "
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />

            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-[17px]
                    bg-[#E7ECF8]
                    text-[#4B517D]
                  "
                >
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                    {
                      selectedExam
                        .subject.name
                    }
                  </p>

                  <h3 className="mt-0.5 text-[17px] font-extrabold text-slate-900">
                    {
                      selectedExam.title
                    }
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedExam(
                    null,
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-50
                  text-slate-500
                "
              >
                ×
              </button>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5 rounded-[18px] bg-[#F7F8FA] p-3.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                {selectedExam.description ||
                  "No description provided."}
              </p>
            </div>

            {/* EXAM INFORMATION */}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-[17px] bg-[#EEF2FA] p-3">
                <p className="text-[8px] text-slate-400">
                  Exam Date
                </p>

                <p className="mt-1 text-[9px] font-bold text-[#4B517D]">
                  {formatDate(
                    selectedExam.examDate,
                  )}
                </p>
              </div>

              <div className="rounded-[17px] bg-[#FFF0D6] p-3">
                <p className="text-[8px] text-slate-400">
                  Total Marks
                </p>

                <p className="mt-1 text-[9px] font-bold text-[#B87938]">
                  {
                    selectedExam.totalMarks
                  }
                </p>
              </div>

              <div className="rounded-[17px] bg-emerald-50 p-3">
                <p className="text-[8px] text-slate-400">
                  Status
                </p>

                <p className="mt-1 text-[9px] font-bold text-emerald-700">
                  {selectedExam
                    .evaluation
                    ? "Result"
                    : isUpcoming(
                          selectedExam.examDate,
                        )
                      ? "Upcoming"
                      : "Completed"}
                </p>
              </div>
            </div>

            {/* RESULT */}

            {selectedExam.evaluation && (
              <div className="mt-3 rounded-[18px] border border-emerald-100 bg-emerald-50 p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-wide text-emerald-600">
                      Result
                    </p>

                    <p className="mt-1 text-[20px] font-extrabold text-emerald-700">
                      {
                        selectedExam
                          .evaluation
                          .obtainedMarks
                      }{" "}
                      /{" "}
                      {
                        selectedExam.totalMarks
                      }
                    </p>
                  </div>

                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                </div>

                {selectedExam
                  .evaluation.remark && (
                  <div className="mt-2 border-t border-emerald-200/60 pt-2">
                    <p className="text-[8px] font-semibold uppercase tracking-wide text-emerald-600">
                      Teacher Remark
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-emerald-800">
                      {
                        selectedExam
                          .evaluation
                          .remark
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TEACHER */}

            <div className="mt-3 flex items-center justify-between rounded-[17px] border border-slate-100 bg-white px-3.5 py-3">
              <div>
                <p className="text-[8px] text-slate-400">
                  Teacher
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {
                    selectedExam
                      .teacher.name
                  }{" "}
                  {
                    selectedExam
                      .teacher.surname
                  }
                </p>
              </div>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[8px]
                  font-bold
                  ${
                    selectedExam
                      .evaluation
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[#FFF0D6] text-[#B87938]"
                  }
                `}
              >
                {selectedExam.evaluation
                  ? "Result Published"
                  : isUpcoming(
                        selectedExam.examDate,
                      )
                    ? "Scheduled"
                    : "Result Pending"}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}