"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { addGrade, deleteGrade } from "@/lib/adminActions";

const initial = { success: false, error: false } as { success: boolean; error: boolean; message?: string };

const GradesManager = ({ grades }: { grades: { id: number; level: number; inUse: boolean }[] }) => {
  const [addState, add, adding] = useActionState(addGrade, initial);
  const [delState, remove] = useActionState(deleteGrade, initial);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (addState.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [addState, router]);
  useEffect(() => {
    if (delState.success) router.refresh();
    if (delState.error) toast.error(delState.message);
  }, [delState, router]);

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-2">
        {grades.length === 0 && <li className="text-sm text-gray-500">No grades yet.</li>}
        {grades.map((g) => (
          <li key={g.id} className="flex items-center gap-1 rounded-full bg-lamaSkyLight pl-3 pr-1 py-1 text-sm">
            {g.level === 0 ? "Grade R" : `Grade ${g.level}`}
            {!g.inUse && (
              <form action={remove}>
                <input type="hidden" name="id" value={g.id} />
                <button title="Remove grade" className="h-5 w-5 rounded-full text-gray-400 hover:bg-white hover:text-red-600">
                  ×
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
      <form ref={formRef} action={add} className="flex items-center gap-2">
        <label htmlFor="grade-level" className="sr-only">Grade</label>
        <input id="grade-level" name="level" type="number" min={0} max={13} required placeholder="e.g. 10" className="form-control w-28" />
        <button className="btn-primary" disabled={adding}>Add grade</button>
      </form>
      {addState.error && <p className="text-sm text-red-500">{addState.message}</p>}
    </div>
  );
};

export default GradesManager;
