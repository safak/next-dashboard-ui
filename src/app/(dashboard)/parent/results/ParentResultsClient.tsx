"use client";

import {
  Award,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
} from "lucide-react";
import { useMemo, useState } from "react";

type ResultItem = {
  id: number;
  type: "EXAM" | "ASSIGNMENT";
  title: string;
  description: string;
  score: number;
  totalMarks: number;
  date: string;

  subject: {
    id: number;
    name: string;
  };

  teacher: {
    name: string;
    surname: string;
  };
};

type Props = {
  results: ResultItem[];
};

type Filter =
  | "ALL"
  | "EXAMS"
  | "ASSIGNMENTS";

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

function getPercentage(
  score: number,
  totalMarks: number,
) {
  if (!totalMarks) {
    return 0;
  }

  return Math.round(
    (score / totalMarks) * 100,
  );
}

function getGrade(
  percentage: number,
) {
  if (percentage >= 90) {
    return "A+";
  }

  if (percentage >= 80) {
    return "A";
  }

  if (percentage >= 70) {
    return "B+";
  }

  if (percentage >= 60) {
    return "B";
  }

  if (percentage >= 50) {
    return "C";
  }

  if (percentage >= 40) {
    return "D";
  }

  return "F";
}

function getGradeStyle(
  percentage: number,
) {
  if (percentage >= 80) {
    return {
      badge:
        "bg-emerald-100 text-emerald-700",
      icon:
        "bg-emerald-50 text-emerald-600",
    };
  }

  if (percentage >= 60) {
    return {
      badge:
        "bg-[#FFF0D6] text-[#B87938]",
      icon:
        "bg-[#FFF4E3] text-[#B87938]",
    };
  }

  return {
    badge:
      "bg-red-100 text-red-600",
    icon:
      "bg-red-50 text-red-500",
  };
}

export default function ParentResultsClient({
  results,
}: Props) {
  const [filter, setFilter] =
    useState<Filter>("ALL");

  const [
    selectedResult,
    setSelectedResult,
  ] = useState<ResultItem | null>(
    null,
  );

  const stats = useMemo(() => {
    const total = results.length;

    const exams = results.filter(
      (item) => item.type === "EXAM",
    ).length;

    const assignments =
      results.filter(
        (item) =>
          item.type === "ASSIGNMENT",
      ).length;

    const average =
      total > 0
        ? Math.round(
            results.reduce(
              (sum, item) =>
                sum +
                getPercentage(
                  item.score,
                  item.totalMarks,
                ),
              0,
            ) / total,
          )
        : 0;

    return {
      total,
      exams,
      assignments,
      average,
    };
  }, [results]);

  const filteredResults =
    useMemo(() => {
      let filtered = results;

      if (filter === "EXAMS") {
        filtered = results.filter(
          (item) =>
            item.type === "EXAM",
        );
      }

      if (filter === "ASSIGNMENTS") {
        filtered = results.filter(
          (item) =>
            item.type ===
            "ASSIGNMENT",
        );
      }

      return [...filtered].sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      );
    }, [results, filter]);

  return (
    <>
      {/* ================= SUMMARY ================= */}

      <section className="mt-6 grid grid-cols-2 gap-2.5">
        <div
          className="
            rounded-[18px]
            bg-[#4B517D]
            px-4
            py-3
            text-white
            shadow-[0_8px_20px_rgba(75,81,125,0.15)]
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/65">
                Average
              </p>

              <p className="mt-1 text-[24px] font-extrabold">
                {stats.average}%
              </p>

              <p className="mt-0.5 text-[8px] text-white/60">
                Overall performance
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                bg-white/10
              "
            >
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className="
            rounded-[18px]
            border
            border-slate-100
            bg-white
            px-4
            py-3
          "
        >
          <p className="text-[9px] text-slate-400">
            Published
          </p>

          <p className="mt-1 text-[24px] font-extrabold text-[#4B517D]">
            {stats.total}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Total results
          </p>
        </div>
      </section>

      {/* ================= FILTERS ================= */}

      <section className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() =>
            setFilter("ALL")
          }
          className={`
            rounded-[16px]
            px-3
            py-2.5
            text-[9px]
            font-bold
            transition
            active:scale-[0.98]
            ${
              filter === "ALL"
                ? "bg-[#4B517D] text-white"
                : "border border-slate-100 bg-white text-slate-500"
            }
          `}
        >
          All
          <span className="ml-1 opacity-70">
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("EXAMS")
          }
          className={`
            rounded-[16px]
            px-3
            py-2.5
            text-[9px]
            font-bold
            transition
            active:scale-[0.98]
            ${
              filter === "EXAMS"
                ? "bg-[#E7ECF8] text-[#4B517D]"
                : "border border-slate-100 bg-white text-slate-500"
            }
          `}
        >
          Exams
          <span className="ml-1 opacity-70">
            {stats.exams}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("ASSIGNMENTS")
          }
          className={`
            rounded-[16px]
            px-3
            py-2.5
            text-[9px]
            font-bold
            transition
            active:scale-[0.98]
            ${
              filter === "ASSIGNMENTS"
                ? "bg-[#FFF0D6] text-[#B87938]"
                : "border border-slate-100 bg-white text-slate-500"
            }
          `}
        >
          Assignments
          <span className="ml-1 opacity-70">
            {stats.assignments}
          </span>
        </button>
      </section>

      {/* ================= RESULT HEADER ================= */}

      <div className="mt-6 flex items-end justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-[#4B517D]">
            Results
          </h2>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {filteredResults.length}{" "}
            {filteredResults.length ===
            1
              ? "result"
              : "results"}
          </p>
        </div>
      </div>

      {/* ================= RESULT LIST ================= */}

      <section className="mt-3 space-y-3">
        {filteredResults.length ===
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
              <GraduationCap className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#4B517D]">
              No results yet
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              Results will appear here once they are published.
            </p>
          </div>
        ) : (
          filteredResults.map(
            (result) => {
              const percentage =
                getPercentage(
                  result.score,
                  result.totalMarks,
                );

              const grade =
                getGrade(
                  percentage,
                );

              const styles =
                getGradeStyle(
                  percentage,
                );

              const isExam =
                result.type ===
                "EXAM";

              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() =>
                    setSelectedResult(
                      result,
                    )
                  }
                  className="
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
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-[17px]
                        ${styles.icon}
                      `}
                    >
                      {isExam ? (
                        <FileCheck2 className="h-5 w-5" />
                      ) : (
                        <ClipboardList className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                            {result.subject.name}
                          </p>

                          <h3 className="mt-0.5 truncate text-[14px] font-extrabold text-slate-900">
                            {result.title}
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
                            ${styles.badge}
                          `}
                        >
                          {grade}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <div>
                          <p className="text-[8px] text-slate-400">
                            Score
                          </p>

                          <p className="mt-0.5 text-[13px] font-extrabold text-[#4B517D]">
                            {result.score}
                            <span className="text-[9px] font-medium text-slate-400">
                              {" "}
                              /{" "}
                              {
                                result.totalMarks
                              }
                            </span>
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] text-slate-400">
                            Percentage
                          </p>

                          <p className="mt-0.5 text-[13px] font-extrabold text-slate-700">
                            {percentage}%
                          </p>
                        </div>

                        <div className="ml-auto text-right">
                          <p className="text-[8px] text-slate-400">
                            {isExam
                              ? "Exam"
                              : "Assignment"}
                          </p>

                          <p className="mt-0.5 text-[9px] font-semibold text-slate-500">
                            {formatDate(
                              result.date,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            },
          )
        )}
      </section>

      {/* ================= RESULT DETAILS ================= */}

      {selectedResult && (
        <>
          <button
            type="button"
            aria-label="Close result details"
            onClick={() =>
              setSelectedResult(
                null,
              )
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

            {/* HEADER */}

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
                  {selectedResult.type ===
                  "EXAM" ? (
                    <FileCheck2 className="h-5 w-5" />
                  ) : (
                    <ClipboardList className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                    {
                      selectedResult
                        .subject.name
                    }
                  </p>

                  <h3 className="mt-0.5 truncate text-[17px] font-extrabold text-slate-900">
                    {
                      selectedResult.title
                    }
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedResult(
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

            {/* SCORE */}

            <div
              className="
                mt-5
                rounded-[22px]
                bg-[#4B517D]
                p-5
                text-white
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-white/60">
                    Final Score
                  </p>

                  <p className="mt-1 text-[31px] font-extrabold">
                    {
                      selectedResult.score
                    }
                    <span className="text-[15px] font-medium text-white/60">
                      {" "}
                      /{" "}
                      {
                        selectedResult.totalMarks
                      }
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] text-white/60">
                    Percentage
                  </p>

                  <p className="mt-1 text-[24px] font-extrabold">
                    {getPercentage(
                      selectedResult.score,
                      selectedResult.totalMarks,
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: `${Math.min(
                      100,
                      getPercentage(
                        selectedResult.score,
                        selectedResult.totalMarks,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* GRADE */}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-[17px] bg-[#EEF2FA] p-3">
                <p className="text-[8px] text-slate-400">
                  Grade
                </p>

                <p className="mt-1 text-[18px] font-extrabold text-[#4B517D]">
                  {getGrade(
                    getPercentage(
                      selectedResult.score,
                      selectedResult.totalMarks,
                    ),
                  )}
                </p>
              </div>

              <div className="rounded-[17px] bg-[#FFF0D6] p-3">
                <p className="text-[8px] text-slate-400">
                  Type
                </p>

                <p className="mt-1 text-[10px] font-bold text-[#B87938]">
                  {selectedResult.type ===
                  "EXAM"
                    ? "Exam"
                    : "Assignment"}
                </p>
              </div>

              <div className="rounded-[17px] bg-emerald-50 p-3">
                <p className="text-[8px] text-slate-400">
                  Date
                </p>

                <p className="mt-1 text-[9px] font-bold text-emerald-700">
                  {formatDate(
                    selectedResult.date,
                  )}
                </p>
              </div>
            </div>

            {/* DETAILS */}

            <div className="mt-3 rounded-[18px] bg-[#F7F8FA] p-3.5">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-1.5 text-[10px] leading-5 text-slate-600">
                {selectedResult.description ||
                  "No description provided."}
              </p>
            </div>

            {/* TEACHER */}

            <div className="mt-3 flex items-center justify-between rounded-[17px] border border-slate-100 bg-white px-3.5 py-3">
              <div>
                <p className="text-[8px] text-slate-400">
                  Teacher
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {
                    selectedResult
                      .teacher.name
                  }{" "}
                  {
                    selectedResult
                      .teacher.surname
                  }
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            {/* DATE */}

            <div className="mt-2 flex items-center gap-2 px-1">
              <CalendarDays className="h-3.5 w-3.5 text-[#4B517D]" />

              <p className="text-[9px] text-slate-400">
                Published result for{" "}
                {formatDate(
                  selectedResult.date,
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}