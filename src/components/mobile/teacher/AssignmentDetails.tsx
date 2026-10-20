"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssignmentDetailsProps {
  assignmentId: string;
}

interface StudentEvaluation {
  id: string;
  name: string;
  surname: string;

  assignmentEvaluations?: {
    obtainedMarks: number;
    remark?: string;
  }[];
}

interface Assignment {
  id: number;
  title: string;
  description?: string;
  totalMarks: number;

  startDate: string;
  dueDate: string;

  subject?: {
    id: number;
    name: string;
  };

  class?: {
    id: number;
    name: string;

    students?: StudentEvaluation[];
  };

  teacher?: {
    id: string;
    name: string;
    surname: string;
  };
}

export default function AssignmentDetails({
  assignmentId,
}: AssignmentDetailsProps) {
  const router = useRouter();

  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchAssignment = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/mobile/teacher/assignments/${assignmentId}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch assignment (${response.status}).`);
      }

      const data: Assignment = await response.json();

      setAssignment(data);
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    void fetchAssignment();
  }, [fetchAssignment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Assignment...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Assignment not found
      </div>
    );
  }

  const students = assignment.class?.students || [];

  const evaluations = students
    .map((student) => student.assignmentEvaluations?.[0]?.obtainedMarks)
    .filter((mark): mark is number => typeof mark === "number");

  const averageMarks =
    evaluations.length > 0
      ? (evaluations.reduce((a, b) => a + b, 0) / evaluations.length).toFixed(1)
      : 0;

  const highestMarks = evaluations.length > 0 ? Math.max(...evaluations) : 0;

  const lowestMarks = evaluations.length > 0 ? Math.min(...evaluations) : 0;

  const evaluatedCount = students.filter(
    (s) => s.assignmentEvaluations?.length,
  ).length;

  const pendingCount = students.length - evaluatedCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="
              w-10
              h-10
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

          <h1 className="text-xl font-bold">Assignment Details</h1>
        </div>
      </div>

      {/* DETAILS */}

      <div className="px-4 mt-5">
        <div className="bg-[#EEF2FF] rounded-[28px] p-5">
          {/* HEADER */}

          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                <Image
                  src="/studAssignment.png"
                  alt="Assignment"
                  width={24}
                  height={24}
                />
              </div>

              <div>
                <h2 className="font-bold text-lg text-slate-900">
                  {assignment.title}
                </h2>

                <p className="text-sm text-slate-500">
                  📚 {assignment.subject?.name}
                </p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              {assignment.totalMarks} Marks
            </div>
          </div>

          {/* DESCRIPTION */}

          <p className="mt-4 text-sm text-slate-700">
            {assignment.description}
          </p>

          {/* INFO */}

          <div className="mt-5 border-t border-white/50 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">🏫 Class</span>

              <span className="font-semibold text-slate-900">
                {assignment.class?.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">📅 Start Date</span>

              <span className="font-semibold text-slate-900">
                {new Date(assignment.startDate).toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">⏰ Due Date</span>

              <span className="font-semibold text-slate-900">
                {new Date(assignment.dueDate).toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>

          {/* STATISTICS */}

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-green-50 rounded-2xl p-3 text-center">
              <p className="text-[10px] text-slate-500">Evaluated</p>

              <p className="text-xl font-bold text-green-600 mt-1">
                {evaluatedCount}
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-3 text-center">
              <p className="text-[10px] text-slate-500">Pending</p>

              <p className="text-xl font-bold text-orange-600 mt-1">
                {pendingCount}
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-3 text-center">
              <p className="text-[10px] text-slate-500">Average</p>

              <p className="text-xl font-bold text-purple-600 mt-1">
                {averageMarks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STUDENTS */}

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Student Marks ({students.length})</h3>

          <button
            onClick={() =>
              router.push(
                `/teacher/mobile/assignments/${assignment.id}/evaluate`,
              )
            }
            className="px-4 py-2 rounded-xl bg-[#7267F6] text-white text-sm font-semibold"
          >
            Evaluate
          </button>
        </div>

        <div className="space-y-3">
          {students.map((student) => {
            const evaluation = student.assignmentEvaluations?.[0];

            return (
              <div
                key={student.id}
                className="
                  bg-white
                  rounded-2xl
                  p-3
                  flex
                  items-center
                  justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-purple-100
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-purple-700
                    "
                  >
                    {student.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {student.name} {student.surname}
                    </p>

                    {evaluation?.remark && (
                      <p className="text-xs text-slate-500">
                        {evaluation.remark}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-purple-100
                    text-purple-700
                    text-xs
                    font-bold
                  "
                >
                  {evaluation
                    ? `${evaluation.obtainedMarks}/${assignment.totalMarks}`
                    : "Pending"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
}
