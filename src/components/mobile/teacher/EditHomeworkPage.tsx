"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  homeworkId: number;
}

export default function EditHomeworkPage({ homeworkId }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

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

      const data = await response.json();

      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
    } catch (error) {
      console.error("Failed to load homework:", error);
    }
  }, [homeworkId]);

  useEffect(() => {
    void fetchHomework();
  }, [fetchHomework]);

  const updateHomework = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/mobile/teacher/homework/${homeworkId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            description,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Homework updated successfully");

      router.push("/teacher/mobile/homework");
    } catch (error) {
      console.error(error);

      alert("Failed to update homework");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 bg-white rounded-2xl shadow flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-bold">Edit Homework</h1>
        </div>

        <div className="mt-8 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full h-14 rounded-2xl border px-4"
          />

          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full rounded-2xl border p-4"
          />

          <button
            onClick={updateHomework}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#7267F6] text-white font-bold"
          >
            {loading ? "Updating..." : "Update Homework"}
          </button>
        </div>
      </div>
    </div>
  );
}
