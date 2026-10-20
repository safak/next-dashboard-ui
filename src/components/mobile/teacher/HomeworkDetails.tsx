"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HomeworkDetailsProps {
  homeworkId: string;
}

interface HomeworkRemark {
  id: number;
  status: "COMPLETED" | "INCOMPLETE" | "NOT_DONE";
  remark?: string;
}

interface Student {
  id: string;
  name: string;
  surname: string;
  homeworkRemarks?: HomeworkRemark[];
}

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;

  class?: {
    id: number;
    name: string;
    students?: Student[];
  };

  subject?: {
    id: number;
    name: string;
  };

  teacher?: {
    id: string;
    name: string;
    surname: string;
  };
}

export default function HomeworkDetails({ homeworkId }: HomeworkDetailsProps) {
  const router = useRouter();

  const [homework, setHomework] = useState<Homework | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchHomework = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/homework/${homeworkId}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to load homework (${response.status}).`);
      }

      const data: Homework = await response.json();

      setHomework(data);
    } catch (error) {
      console.error("Failed to load homework:", error);
      setHomework(null);
    } finally {
      setLoading(false);
    }
  }, [homeworkId]);

  useEffect(() => {
    void fetchHomework();
  }, [fetchHomework]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-slate-400">Loading homework...</p>
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-slate-400">Homework not found</p>
      </div>
    );
  }

  const today = new Date();

  const dueDate = new Date(homework.dueDate);

  const isToday = dueDate.toDateString() === today.toDateString();

  const isOverdue = dueDate < today && !isToday;

  const completedCount =
    homework.class?.students?.filter(
      (student) => student.homeworkRemarks?.[0]?.status === "COMPLETED",
    ).length || 0;

  const incompleteCount =
    homework.class?.students?.filter(
      (student) => student.homeworkRemarks?.[0]?.status === "INCOMPLETE",
    ).length || 0;

  const notDoneCount =
    homework.class?.students?.filter(
      (student) => student.homeworkRemarks?.[0]?.status === "NOT_DONE",
    ).length || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="
              w-8
              h-8
              rounded-2xl
              bg-white
              shadow
              flex
              items-center
              justify-center
            "
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-[20px] font-extrabold text-slate-900">
            Homework Details
          </h1>
        </div>
      </div>

      {/* CONTENT */}

      <div className="px-4 mt-6">
        <div className="bg-[#DFF5FF] rounded-[28px] p-4">
          {/* TITLE */}

          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-2xl bg-white flex items-center justify-center">
                <Image
                  src="/homework.png"
                  alt="Homework"
                  width={16}
                  height={16}
                />
              </div>

              <div>
                <h2 className="text-[14px] font-bold text-slate-900">
                  {homework.title}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  📚 {homework.subject?.name}
                </p>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                isOverdue
                  ? "bg-red-100 text-red-700"
                  : isToday
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
              }`}
            >
              {isOverdue ? "Overdue" : isToday ? "Due Today" : "Pending"}
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="mt-2.5 text-[13px] text-slate-600 truncate">
            <span className="font-medium text-slate-700">Description</span>

            <span className="mx-1 text-slate-300">-</span>
            {homework.description}
          </div>

          {/* INFO */}

          <div className="mt-5 border-t border-white/40 pt-4">
            <div className="flex items-center justify-between bg-white/60 rounded-2xl px-4 py-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-400">📅 Due</p>
                <p className="text-xs font-bold">
                  {dueDate.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="w-px h-8 bg-slate-200" />

              <div className="text-center">
                <p className="text-[10px] text-slate-400">🏫 Class</p>
                <p className="text-xs font-bold">{homework.class?.name}</p>
              </div>

              <div className="w-px h-8 bg-slate-200" />

              <div className="text-center">
                <p className="text-[10px] text-slate-400">👩‍🏫 Teacher</p>
                <p className="text-xs font-bold truncate max-w-[70px]">
                  {homework.teacher?.name}
                </p>
              </div>
            </div>

            {/* HOMEWORK SUMMARY */}

            <div className="mt-5 border-t border-white/40 pt-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-slate-500">Completed</p>

                  <p className="text-lg font-bold text-green-600">
                    {completedCount}
                  </p>
                </div>

                <div className="bg-orange-50 rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-slate-500">Incomplete</p>

                  <p className="text-lg font-bold text-orange-600">
                    {incompleteCount}
                  </p>
                </div>

                <div className="bg-red-50 rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-slate-500">Not Done</p>

                  <p className="text-lg font-bold text-red-600">
                    {notDoneCount}
                  </p>
                </div>
              </div>
            </div>

            {/* STUDENT STATUS */}

            <div className="mt-6 border-t border-white/40 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">
                  Student Homework Status
                </h3>

                <span className="text-xs text-slate-500">
                  {homework.class?.students?.length} Students
                </span>

                <button
                  onClick={() =>
                    router.push(
                      `/teacher/mobile/homework/${homework.id}/review`,
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#7267F6] text-white text-xs font-semibold"
                >
                  Review
                </button>
              </div>

              <div className="space-y-3">
                {homework.class?.students?.length ? (
                  homework.class.students.map((student) => {
                    const review = student.homeworkRemarks?.[0];

                    return (
                      <div
                        key={student.id}
                        className="bg-white/70 rounded-2xl px-3 py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">
                            {student.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {student.name} {student.surname}
                            </p>

                            {review?.remark && (
                              <p className="text-xs text-slate-500">
                                {review.remark}
                              </p>
                            )}
                          </div>
                        </div>

                        {review?.status === "COMPLETED" ? (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            Completed
                          </span>
                        ) : review?.status === "INCOMPLETE" ? (
                          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                            Incomplete
                          </span>
                        ) : review?.status === "NOT_DONE" ? (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                            Not Done
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                            Not Reviewed
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No students found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
