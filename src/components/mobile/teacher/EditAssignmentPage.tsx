"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Assignment {
  id: number;
  title: string;
  description?: string;
  totalMarks: number;
  startDate: string;
  dueDate: string;
}

export default function EditAssignmentPage({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState(20);

  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/mobile/teacher/assignments/${assignmentId}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to load assignment (${response.status}).`);
      }

      const data: Assignment = await response.json();

      setTitle(data.title);
      setDescription(data.description ?? "");
      setTotalMarks(data.totalMarks);

      setStartDate(data.startDate.split("T")[0]);
      setDueDate(data.dueDate.split("T")[0]);
    } catch (error) {
      console.error("Failed to load assignment:", error);
      toast.error("Failed to load assignment");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    void fetchAssignment();
  }, [fetchAssignment]);

  const updateAssignment = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `/api/mobile/teacher/assignments/${assignmentId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            description,
            totalMarks,
            startDate,
            dueDate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Assignment updated");

      router.push(`/teacher/mobile/assignments/${assignmentId}`);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update assignment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

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

          <h1 className="text-xl font-bold">Edit Assignment</h1>
        </div>
      </div>

      {/* FORM */}

      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              mt-2
              w-full
              h-12
              border
              rounded-2xl
              px-4
            "
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              mt-2
              w-full
              border
              rounded-2xl
              p-4
            "
          />
        </div>

        <div>
          <label className="text-sm font-medium">Total Marks</label>

          <input
            type="number"
            min={1}
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            className="
              mt-2
              w-full
              h-12
              border
              rounded-2xl
              px-4
            "
          />
        </div>

        <div>
          <label className="text-sm font-medium">Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="
              mt-2
              w-full
              h-12
              border
              rounded-2xl
              px-4
            "
          />
        </div>

        <div>
          <label className="text-sm font-medium">Due Date</label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="
              mt-2
              w-full
              h-12
              border
              rounded-2xl
              px-4
            "
          />
        </div>

        <button
          onClick={updateAssignment}
          disabled={saving}
          className="
            w-full
            h-12
            rounded-2xl
            bg-[#7267F6]
            text-white
            font-semibold
          "
        >
          {saving ? "Updating..." : "Update Assignment"}
        </button>
      </div>
    </div>
  );
}
