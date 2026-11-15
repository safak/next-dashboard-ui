"use client";

import { setExtraClassRegistration } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";

type State = { success: boolean; error: boolean; message?: string };

// Admin control on the roster page: pick any student and register them
const ExtraClassAddStudent = ({
  extraClassId,
  students,
  full,
}: {
  extraClassId: number;
  students: { id: string; name: string; surname: string; className: string }[];
  full: boolean;
}) => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [state, action, pending] = useActionState<
    State,
    { extraClassId: number; studentId: string; register: boolean }
  >(setExtraClassRegistration, { success: false, error: false });

  useEffect(() => {
    if (state.success) {
      toast("Student added!");
      setStudentId("");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router]);

  if (full) {
    return <p className="text-sm text-gray-500">This class is full.</p>;
  }

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!studentId) return;
        startTransition(() =>
          action({ extraClassId, studentId, register: true })
        );
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">Add a student</span>
        <select
          className="form-control min-w-64"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select a student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.surname} ({s.className})
            </option>
          ))}
        </select>
      </label>
      <button className="btn-primary" disabled={pending || !studentId}>
        {pending ? "Adding..." : "Add"}
      </button>
    </form>
  );
};

export default ExtraClassAddStudent;
