"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Student {
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
  totalMarks: number;

  class?: {
    students: Student[];
  };
}

export default function ExamEvaluationPage({ examId }: { examId: string }) {
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

  const saveEvaluation = async (
    studentId: string,
    obtainedMarks: number,
    remark: string,
  ) => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/exams/${examId}/evaluate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            examId: Number(examId),
            studentId,
            obtainedMarks,
            remark,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success("Marks saved successfully");

      fetchExam();
    } catch (error) {
      console.error(error);

      toast.error("Failed to save marks");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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

  const evaluatedCount = students.filter(
    (student) => student.evaluations?.length,
  ).length;

  const pendingCount = students.length - evaluatedCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Evaluate Exam</h1>
            <p className="text-xs text-slate-400">{exam.title}</p>
          </div>
        </div>
      </div>

      {/* MARKS CARD */}

      <div className="px-4 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#EEF2FF] rounded-2xl p-3">
            <p className="text-[11px] text-slate-500">Total</p>

            <h2 className="text-2xl font-bold text-purple-700">
              {exam.totalMarks}
            </h2>
          </div>

          <div className="bg-green-50 rounded-2xl p-3">
            <p className="text-[11px] text-slate-500">Done</p>

            <h2 className="text-2xl font-bold text-green-600">
              {evaluatedCount}
            </h2>
          </div>

          <div className="bg-orange-50 rounded-2xl p-3">
            <p className="text-[11px] text-slate-500">Pending</p>

            <h2 className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </h2>
          </div>
        </div>
      </div>

      {/* STUDENTS */}

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">
            Students ({students.length})
          </h3>
        </div>

        <div className="space-y-3">
          {students.map((student) => {
            const evaluation = student.evaluations?.[0];

            return (
              <StudentCard
                key={`${student.id}-${evaluation?.obtainedMarks ?? "new"}`}
                student={student}
                totalMarks={exam.totalMarks}
                defaultMarks={evaluation?.obtainedMarks ?? 0}
                defaultRemark={evaluation?.remark ?? ""}
                onSave={saveEvaluation}
              />
            );
          })}
        </div>

        {students.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
}

function StudentCard({
  student,
  totalMarks,
  defaultMarks,
  defaultRemark,
  onSave,
}: {
  student: Student;
  totalMarks: number;
  defaultMarks: number;
  defaultRemark: string;
  onSave: (
    studentId: string,
    obtainedMarks: number,
    remark: string,
  ) => Promise<void> | void;
}) {
  const [marks, setMarks] = useState(defaultMarks ? String(defaultMarks) : "");

  const [remark, setRemark] = useState(defaultRemark);

  const [saving, setSaving] = useState(false);

  const [updated, setUpdated] = useState(false);

  const isEvaluated = defaultMarks > 0;

  const handleSave = async () => {
    setSaving(true);

    await onSave(student.id, Number(marks), remark);

    setSaving(false);

    setUpdated(true);

    setTimeout(() => {
      setUpdated(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div
          className="
            w-11
            h-11
            rounded-full
            bg-purple-100
            flex
            items-center
            justify-center
            font-bold
            text-purple-700
            shrink-0
          "
        >
          {student.name.charAt(0)}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm">
            {student.name} {student.surname}
          </h3>

          <p className="text-xs text-slate-400">Student Evaluation</p>
        </div>

        {isEvaluated ? (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            ✓ Evaluated
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            Pending
          </span>
        )}
      </div>

      {/* Inputs */}

      <div className="mt-4 flex gap-3 items-end">
        {/* Marks */}

        <div className="w-[90px]">
          <label className="text-xs text-slate-500 mb-1 block">Marks</label>

          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={totalMarks}
              value={marks}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setMarks("");
                  return;
                }

                const num = Number(value);

                if (num >= 0 && num <= totalMarks) {
                  setMarks(value);
                }
              }}
              className="
          w-14
          h-11
          rounded-xl
          border
          border-slate-200
          text-center
          outline-none
          focus:border-[#7267F6]
          font-semibold
        "
            />

            <span className="text-[16px] font-bold text-slate-500">
              /{totalMarks}
            </span>
          </div>
        </div>

        {/* Remark */}

        <div className="flex-1">
          <label className="text-xs text-slate-500 mb-1 block">Remark</label>

          <input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Excellent..."
            className="
        w-full
        h-11
        rounded-xl
        border
        border-slate-200
        px-3
        outline-none
        focus:border-[#7267F6]
      "
          />
        </div>
      </div>

      {/* Footer */}

      <div className="mt-4 flex items-center justify-between">
        {updated ? (
          <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold">
            ✓ Updated
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="
              px-6
              h-10
              rounded-xl
              bg-[#7267F6]
              text-white
              text-sm
              font-semibold
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : isEvaluated ? "Update" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}
