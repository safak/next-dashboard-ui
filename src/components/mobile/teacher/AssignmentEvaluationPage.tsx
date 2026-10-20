"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Student {
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
  totalMarks: number;

  class?: {
    id: number;
    name: string;
    students?: Student[];
  };
}

export default function AssignmentEvaluationPage({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const router = useRouter();

  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchAssignment = useCallback(async () => {
    try {
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

  const saveEvaluation = async (
    studentId: string,
    obtainedMarks: number,
    remark: string,
  ) => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/assignments/${assignmentId}/evaluate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            assignmentId: Number(assignmentId),
            studentId,
            obtainedMarks,
            remark,
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Marks saved successfully");

      fetchAssignment();
    } catch (error) {
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

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Assignment not found
      </div>
    );
  }

  const students = assignment.class?.students || [];

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

          <div>
            <h1 className="text-xl font-bold">Evaluate Assignment</h1>

            <p className="text-xs text-slate-400">{assignment.title}</p>
          </div>
        </div>
      </div>

      {/* TOTAL MARKS */}

      <div className="px-4 mt-5">
        <div className="bg-[#EEF2FF] rounded-3xl p-4">
          <p className="text-sm text-slate-500">Total Marks</p>

          <h2 className="text-3xl font-bold text-purple-700 mt-1">
            {assignment.totalMarks}
          </h2>
        </div>
      </div>

      {/* STUDENTS */}

      <div className="px-4 mt-5 space-y-4">
        {students.map((student) => {
          const evaluation = student.assignmentEvaluations?.[0];

          return (
            <StudentCard
              key={student.id}
              student={student}
              totalMarks={assignment.totalMarks}
              defaultMarks={evaluation?.obtainedMarks ?? 0}
              defaultRemark={evaluation?.remark ?? ""}
              onSave={saveEvaluation}
            />
          );
        })}
      </div>

      <div className="h-20" />
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

  onSave: (studentId: string, obtainedMarks: number, remark: string) => void;
}) {
  const [marks, setMarks] = useState(
    defaultMarks > 0 ? String(defaultMarks) : "",
  );

  const [remark, setRemark] = useState(defaultRemark);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
          {student.name.charAt(0)}
        </div>

        <div>
          <h3 className="font-bold text-sm">
            {student.name} {student.surname}
          </h3>

          <p className="text-xs text-slate-400">Student Evaluation</p>
        </div>
      </div>

      {/* MARKS */}

      <div className="mt-4">
        <label className="text-xs text-slate-500">Marks Obtained</label>

        <input
          type="number"
          placeholder={`0 - ${totalMarks}`}
          min={0}
          max={totalMarks}
          value={marks}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "" || Number(value) <= totalMarks) {
              setMarks(value);
            }
          }}
          className="
            mt-2
            w-full
            h-12
            rounded-2xl
            border
            px-4
            outline-none
          "
        />
      </div>

      {/* REMARK */}

      <div className="mt-3">
        <label className="text-xs text-slate-500">Remark</label>

        <textarea
          rows={2}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="
            mt-2
            w-full
            rounded-2xl
            border
            p-3
            outline-none
          "
        />
      </div>

      {/* SAVE */}

      <button
        onClick={() => onSave(student.id, Number(marks || 0), remark)}
        className="
          mt-4
          w-full
          h-11
          rounded-2xl
          bg-[#7267F6]
          text-white
          font-semibold
        "
      >
        Save Evaluation
      </button>
    </div>
  );
}
