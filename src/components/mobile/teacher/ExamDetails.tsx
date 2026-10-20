"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface StudentEvaluation {
  id: string;
  name: string;
  surname: string;

  evaluations?: {
    obtainedMarks: number;
    remark?: string;
  }[];
}

interface Exam {
  id: number;

  title: string;
  description?: string;

  totalMarks: number;

  examDate: string;

  class?: {
    id: number;
    name: string;

    students?: StudentEvaluation[];
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

export default function ExamDetails({ examId }: { examId: string }) {
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchExam = useCallback(async () => {
    try {
      const response = await fetch(`/api/mobile/teacher/exams/${examId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load exam (${response.status}).`);
      }

      const data: Exam = await response.json();

      setExam(data);
    } catch (error) {
      console.error("Failed to load exam:", error);
      setExam(null);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    void fetchExam();
  }, [fetchExam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Exam...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Exam not found
      </div>
    );
  }

  const students = exam.class?.students || [];

  const evaluations = students
    .map((student) => student.evaluations?.[0]?.obtainedMarks)
    .filter((mark): mark is number => typeof mark === "number");

  const evaluatedCount = evaluations.length;

  const pendingCount = students.length - evaluatedCount;

  const averageMarks =
    evaluations.length > 0
      ? (evaluations.reduce((a, b) => a + b, 0) / evaluations.length).toFixed(1)
      : "0";

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

          <h1 className="text-xl font-bold">Exam Details</h1>
        </div>
      </div>

      {/* EXAM CARD */}

      <div className="px-4 mt-5">
        <div className="bg-[#EEF2FF] rounded-[28px] p-5">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                <Image src="/exam.png" alt="Exam" width={24} height={24} />
              </div>

              <div>
                <h2 className="font-bold text-lg">{exam.title}</h2>

                <p className="text-sm text-slate-500">{exam.description}</p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              {exam.totalMarks} Marks
            </div>
          </div>

          {/* Exam Information */}

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-100">
              {/* <span className="text-[11px] text-slate-500">Class:</span> */}

              <span className="text-[12px] font-bold text-slate-800">
                {exam.class?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-white border border-slate-100">
              {/* <span className="text-[11px] text-slate-500">Subject:</span> */}

              <span className="text-[12px] font-bold text-slate-800">
                {exam.subject?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-white border border-slate-100">
              <span className="text-[11px] text-slate-500">📅</span>

              <span className="text-[12px] font-bold text-slate-800">
                {new Date(exam.examDate).toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <p className="text-[11px] text-slate-500">Evaluated</p>

              <p className="text-lg font-bold text-green-600">
                {evaluatedCount}
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <p className="text-[11px] text-slate-500">Pending</p>

              <p className="text-lg font-bold text-orange-600">
                {pendingCount}
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <p className="text-[11px] text-slate-500">Average</p>

              <p className="text-lg font-bold text-purple-600">
                {averageMarks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STUDENTS */}

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">List of Students ({students.length})</h3>

          <button
            onClick={() =>
              router.push(`/teacher/mobile/exams/${exam.id}/evaluate`)
            }
            className="
              px-4
              py-2
              rounded-xl
              bg-[#7267F6]
              text-white
              text-sm
              font-semibold
            "
          >
            Evaluate
          </button>
        </div>

        <div className="space-y-3">
          {students.map((student) => {
            const evaluation = student.evaluations?.[0];

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

                    <p className="text-xs text-slate-500">
                      {evaluation?.remark || "Not Evaluated"}
                    </p>
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
                    ? `${evaluation.obtainedMarks}/${exam.totalMarks}`
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
