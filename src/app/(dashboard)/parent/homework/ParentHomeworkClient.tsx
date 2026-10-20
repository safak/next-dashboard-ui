"use client";

import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type HomeworkItem = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;

  subject: {
    id: number;
    name: string;
  };

  teacher: {
    name: string;
    surname: string;
  };

  status: string | null;
  remark: string | null;
};

type Props = {
  homework: HomeworkItem[];
};

type Filter = "ALL" | "PENDING" | "COMPLETED" | "NOT_DONE";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatus(item: HomeworkItem) {
  if (item.status === "COMPLETED") {
    return "COMPLETED";
  }

  if (item.status === "NOT_DONE" || item.status === "INCOMPLETE") {
    return "NOT_DONE";
  }

  return "PENDING";
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

export default function ParentHomeworkClient({ homework }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(
    null,
  );

  const filteredHomework = useMemo(() => {
    if (filter === "ALL") {
      return homework;
    }

    return homework.filter((item) => getStatus(item) === filter);
  }, [homework, filter]);

  const counts = useMemo(() => {
    return {
      all: homework.length,

      pending: homework.filter((item) => getStatus(item) === "PENDING").length,

      completed: homework.filter((item) => getStatus(item) === "COMPLETED")
        .length,

      notDone: homework.filter((item) => getStatus(item) === "NOT_DONE").length,
    };
  }, [homework]);

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
            Homework
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

      {/* ================= FILTER ================= */}

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-[#4B517D]">Homework</h2>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {filteredHomework.length}{" "}
            {filteredHomework.length === 1 ? "item" : "items"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFilter(filter === "NOT_DONE" ? "ALL" : "NOT_DONE")}
          className={`
            rounded-full
            px-3
            py-1.5
            text-[9px]
            font-semibold
            transition
            ${
              filter === "NOT_DONE"
                ? "bg-red-50 text-red-600"
                : "bg-white text-slate-500"
            }
          `}
        >
          {filter === "NOT_DONE" ? "Showing Not Done" : "Not Done"}
        </button>
      </div>

      {/* ================= LIST ================= */}

      <section className="mt-3 space-y-3">
        {filteredHomework.length === 0 ? (
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
              <BookOpenCheck className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#4B517D]">
              No homework found
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              There is no homework in this category.
            </p>
          </div>
        ) : (
          filteredHomework.map((item) => {
            const status = getStatus(item);

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedHomework(item)}
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
                      bg-[#E7ECF8]
                      text-[#4B517D]
                    "
                  >
                    <BookOpenCheck className="h-5 w-5" strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                          {item.subject.name}
                        </p>

                        <h3 className="mt-0.5 truncate text-[14px] font-extrabold text-slate-900">
                          {item.title}
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
                              : status === "NOT_DONE"
                                ? "bg-red-100 text-red-600"
                                : "bg-[#FFF0D6] text-[#B87938]"
                          }
                        `}
                      >
                        {status === "COMPLETED"
                          ? "Completed"
                          : status === "NOT_DONE"
                            ? "Not Done"
                            : "Pending"}
                      </span>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-[9px] text-slate-400">
                        <CalendarDays className="h-3 w-3" />

                        {formatDate(item.dueDate)}
                      </span>

                      <span className="flex items-center gap-1 text-[9px] font-semibold text-[#B87938]">
                        <Clock3 className="h-3 w-3" />

                        {getDueText(item.dueDate)}
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

      {selectedHomework && (
        <>
          <button
            type="button"
            aria-label="Close homework details"
            onClick={() => setSelectedHomework(null)}
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
                    {selectedHomework.subject.name}
                  </p>

                  <h3 className="mt-0.5 text-[17px] font-extrabold text-slate-900">
                    {selectedHomework.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHomework(null)}
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

            <div className="mt-5 rounded-[18px] bg-[#F7F8FA] p-3.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                {selectedHomework.description}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-[17px] bg-[#EEF2FA] p-3">
                <p className="text-[8px] text-slate-400">Assigned</p>

                <p className="mt-1 text-[10px] font-bold text-[#4B517D]">
                  {formatDate(selectedHomework.createdAt)}
                </p>
              </div>

              <div className="rounded-[17px] bg-[#FFF0D6] p-3">
                <p className="text-[8px] text-slate-400">Due Date</p>

                <p className="mt-1 text-[10px] font-bold text-[#B87938]">
                  {formatDate(selectedHomework.dueDate)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-[17px] border border-slate-100 bg-white px-3.5 py-3">
              <div>
                <p className="text-[8px] text-slate-400">Teacher</p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {selectedHomework.teacher.name}{" "}
                  {selectedHomework.teacher.surname}
                </p>
              </div>

              {getStatus(selectedHomework) === "COMPLETED" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : getStatus(selectedHomework) === "NOT_DONE" ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock3 className="h-5 w-5 text-[#F59A23]" />
              )}
            </div>

            {selectedHomework.remark && (
              <div className="mt-3 rounded-[17px] bg-[#F7F8FA] p-3">
                <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                  Teacher Remark
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-600">
                  {selectedHomework.remark}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
