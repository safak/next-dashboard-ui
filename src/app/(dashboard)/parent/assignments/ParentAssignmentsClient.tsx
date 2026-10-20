"use client";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
} from "lucide-react";
import { useMemo, useState } from "react";

type AssignmentItem = {
  id: number;
  title: string;
  description: string;
  totalMarks: number;
  startDate: string;
  dueDate: string;

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
  assignments: AssignmentItem[];
};

type Filter = "ALL" | "PENDING" | "COMPLETED";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatus(assignment: AssignmentItem) {
  return assignment.evaluation ? "COMPLETED" : "PENDING";
}

function getDueText(dueDate: string) {
  const due = new Date(dueDate);
  const today = new Date();

  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = due.getTime() - today.getTime();

  const days = Math.round(difference / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return `${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} overdue`;
  }

  if (days === 0) {
    return "Due today";
  }

  if (days === 1) {
    return "Due tomorrow";
  }

  return `Due in ${days} days`;
}

export default function ParentAssignmentsClient({ assignments }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentItem | null>(null);

  const filteredAssignments = useMemo(() => {
    if (filter === "ALL") {
      return assignments;
    }

    return assignments.filter((item) => getStatus(item) === filter);
  }, [assignments, filter]);

  const counts = useMemo(() => {
    return {
      all: assignments.length,

      pending: assignments.filter((item) => getStatus(item) === "PENDING")
        .length,

      completed: assignments.filter((item) => getStatus(item) === "COMPLETED")
        .length,
    };
  }, [assignments]);

  return (
    <>
      {/* ================= SUMMARY ================= */}

      <section className="mt-6 grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
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
              filter === "ALL" ? "text-white/70" : "text-slate-400"
            }`}
          >
            Total
          </p>

          <p className="mt-1 text-[21px] font-extrabold">{counts.all}</p>

          <p
            className={`mt-0.5 text-[8px] ${
              filter === "ALL" ? "text-white/60" : "text-slate-400"
            }`}
          >
            Assignments
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("PENDING")}
          className={`
            rounded-[18px]
            border
            px-3
            py-3
            text-left
            transition
            active:scale-[0.98]
            ${
              filter === "PENDING"
                ? "border-[#F59A23]/20 bg-[#FFF0D6]"
                : "border-slate-100 bg-white"
            }
          `}
        >
          <p className="text-[9px] text-slate-400">Pending</p>

          <p className="mt-1 text-[21px] font-extrabold text-[#B87938]">
            {counts.pending}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">To complete</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("COMPLETED")}
          className={`
            rounded-[18px]
            border
            px-3
            py-3
            text-left
            transition
            active:scale-[0.98]
            ${
              filter === "COMPLETED"
                ? "border-emerald-100 bg-emerald-50"
                : "border-slate-100 bg-white"
            }
          `}
        >
          <p className="text-[9px] text-slate-400">Done</p>

          <p className="mt-1 text-[21px] font-extrabold text-emerald-600">
            {counts.completed}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">Completed</p>
        </button>
      </section>

      {/* ================= TITLE ================= */}

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-[#4B517D]">Assignments</h2>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {filteredAssignments.length}{" "}
            {filteredAssignments.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* ================= LIST ================= */}

      <section className="mt-3 space-y-3">
        {filteredAssignments.length === 0 ? (
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
              <ClipboardList className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#4B517D]">
              No assignments found
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              There are no assignments in this category.
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const status = getStatus(assignment);

            return (
              <button
                type="button"
                key={assignment.id}
                onClick={() => setSelectedAssignment(assignment)}
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
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[16px]
                        bg-[#F6EBDD]
                        text-[#B87938]
                      "
                  >
                    <ClipboardList className="h-5 w-5" strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                          {assignment.subject.name}
                        </p>

                        <h3 className="mt-0.5 truncate text-[14px] font-extrabold text-slate-900">
                          {assignment.title}
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
                              status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-[#FFF0D6] text-[#B87938]"
                            }
                          `}
                      >
                        {status === "COMPLETED" ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
                      {assignment.description || "No description provided."}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-[9px] text-slate-400">
                        <CalendarDays className="h-3 w-3" />

                        {formatDate(assignment.dueDate)}
                      </span>

                      <span className="flex items-center gap-1 text-[9px] font-semibold text-[#B87938]">
                        <Clock3 className="h-3 w-3" />

                        {getDueText(assignment.dueDate)}
                      </span>

                      <span className="text-[9px] font-semibold text-slate-400">
                        {assignment.totalMarks} marks
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </section>

      {/* ================= DETAILS SHEET ================= */}

      {selectedAssignment && (
        <>
          <button
            type="button"
            aria-label="Close assignment details"
            onClick={() => setSelectedAssignment(null)}
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
                    bg-[#F6EBDD]
                    text-[#B87938]
                  "
                >
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                    {selectedAssignment.subject.name}
                  </p>

                  <h3 className="mt-0.5 text-[17px] font-extrabold text-slate-900">
                    {selectedAssignment.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
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
                {selectedAssignment.description || "No description provided."}
              </p>
            </div>

            {/* DATES / MARKS */}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-[17px] bg-[#EEF2FA] p-3">
                <p className="text-[8px] text-slate-400">Start Date</p>

                <p className="mt-1 text-[9px] font-bold text-[#4B517D]">
                  {formatDate(selectedAssignment.startDate)}
                </p>
              </div>

              <div className="rounded-[17px] bg-[#FFF0D6] p-3">
                <p className="text-[8px] text-slate-400">Due Date</p>

                <p className="mt-1 text-[9px] font-bold text-[#B87938]">
                  {formatDate(selectedAssignment.dueDate)}
                </p>
              </div>

              <div className="rounded-[17px] bg-emerald-50 p-3">
                <p className="text-[8px] text-slate-400">Total Marks</p>

                <p className="mt-1 text-[9px] font-bold text-emerald-700">
                  {selectedAssignment.totalMarks}
                </p>
              </div>
            </div>

            {/* STUDENT RESULT */}

            {selectedAssignment.evaluation && (
              <div className="mt-3 rounded-[18px] border border-emerald-100 bg-emerald-50 p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-wide text-emerald-600">
                      Result
                    </p>

                    <p className="mt-1 text-[18px] font-extrabold text-emerald-700">
                      {selectedAssignment.evaluation.obtainedMarks} /{" "}
                      {selectedAssignment.totalMarks}
                    </p>
                  </div>

                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>

                {selectedAssignment.evaluation.remark && (
                  <div className="mt-2 border-t border-emerald-200/60 pt-2">
                    <p className="text-[8px] font-semibold uppercase tracking-wide text-emerald-600">
                      Teacher Remark
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-emerald-800">
                      {selectedAssignment.evaluation.remark}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TEACHER */}

            <div className="mt-3 flex items-center justify-between rounded-[17px] border border-slate-100 bg-white px-3.5 py-3">
              <div>
                <p className="text-[8px] text-slate-400">Teacher</p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {selectedAssignment.teacher.name}{" "}
                  {selectedAssignment.teacher.surname}
                </p>
              </div>

              {selectedAssignment.evaluation ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[8px] font-bold text-emerald-700">
                  Evaluated
                </span>
              ) : (
                <span className="rounded-full bg-[#FFF0D6] px-2.5 py-1 text-[8px] font-bold text-[#B87938]">
                  Pending
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
