"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateStudentSubjects } from "@/lib/adminActions";
import SubjectPicker, { SubjectChoice, SubjectOption } from "./forms/SubjectPicker";

// Admin dialog to change which subjects a learner takes and how
const StudentSubjectsEditor = ({
  studentId,
  subjects,
  current,
}: {
  studentId: string;
  subjects: SubjectOption[];
  current: SubjectChoice[];
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<SubjectChoice[]>(current);
  const [tried, setTried] = useState(false);
  const [state, action, pending] = useActionState(updateStudentSubjects, {
    success: false,
    error: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast("Subjects updated!");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const missing =
    value.length === 0
      ? "Choose at least one subject."
      : value.some((v) => !v.format)
      ? "Choose a lesson type for each subject."
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setValue(current);
          setTried(false);
          setOpen(true);
        }}
        className="text-xs font-medium text-indigo-600 hover:underline"
      >
        Edit subjects
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div role="dialog" aria-modal="true" className="bg-white p-6 rounded-2xl shadow-xl relative w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col gap-4">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold">Subjects and lesson types</h2>
            <SubjectPicker subjects={subjects} value={value} onChange={setValue} showErrors={tried} />
            {tried && missing && <p className="text-sm text-red-500">{missing}</p>}
            {state.error && <p className="text-sm text-red-500">{state.message}</p>}
            <button
              type="button"
              className="btn-primary self-start"
              disabled={pending}
              onClick={() => {
                setTried(true);
                if (missing) return;
                startTransition(() =>
                  action({
                    studentId,
                    subjects: value.map((v) => ({ subjectId: v.subjectId, format: v.format! })),
                  })
                );
              }}
            >
              {pending ? "Saving..." : "Save subjects"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentSubjectsEditor;
