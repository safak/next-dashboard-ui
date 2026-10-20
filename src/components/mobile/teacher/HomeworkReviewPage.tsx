"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Student {
  id: string;
  name: string;
  surname: string;

  homeworkRemarks?: {
    status: string;
    remark?: string;
  }[];
}

export default function HomeworkReviewPage({
  homeworkId,
}: {
  homeworkId: string;
}) {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/homework/${homeworkId}/review`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch students (${response.status}).`);
      }

      const data: Student[] = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load homework reviews");
    }
  }, [homeworkId]);

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  const saveReview = async (studentId: string, status: string) => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/homework/${homeworkId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            homeworkId: Number(homeworkId),
            studentId,
            status,
            remark: remarks[studentId] || "",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      toast.success("Review saved");

      fetchStudents();
    } catch (error) {
      toast.error("Failed to save review");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-xl font-bold">Homework Review</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {students.map((student) => {
          const review = student.homeworkRemarks?.[0];

          return (
            <div
              key={student.id}
              className="
                bg-white
                rounded-3xl
                p-4
                shadow-sm
              "
            >
              <h3 className="font-bold">
                {student.name} {student.surname}
              </h3>

              <div className="mt-4">
                <textarea
                  value={remarks[student.id] ?? review?.remark ?? ""}
                  onChange={(e) =>
                    setRemarks((prev) => ({
                      ...prev,
                      [student.id]: e.target.value,
                    }))
                  }
                  placeholder="Add remark..."
                  rows={2}
                  className="
      w-full
      rounded-xl
      border
      border-slate-200
      p-3
      text-sm
      outline-none
      resize-none
    "
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => saveReview(student.id, "COMPLETED")}
                  className={`px-3 py-2 rounded-xl text-xs ${
                    review?.status === "COMPLETED"
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "bg-green-100"
                  }`}
                >
                  Completed
                </button>

                <button
                  onClick={() => saveReview(student.id, "INCOMPLETE")}
                  className={`px-3 py-2 rounded-xl text-xs ${
                    review?.status === "INCOMPLETE"
                      ? "bg-orange-500 text-white shadow-lg scale-105"
                      : "bg-orange-100"
                  }`}
                >
                  Incomplete
                </button>

                <button
                  onClick={() => saveReview(student.id, "NOT_DONE")}
                  className={`px-3 py-2 rounded-xl text-xs ${
                    review?.status === "NOT_DONE"
                      ? "bg-red-500 text-white shadow-lg scale-105"
                      : "bg-red-100"
                  }`}
                >
                  Not Done
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
