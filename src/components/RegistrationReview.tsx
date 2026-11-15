"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { approveRegistration, rejectRegistration } from "@/lib/registrationActions";

type ClassOption = { id: number; name: string; taken: number; capacity: number };

// Approve (with a class) or reject a pending student registration
const RegistrationReview = ({
  id,
  classes,
}: {
  id: string;
  classes: ClassOption[];
}) => {
  const router = useRouter();
  const [classId, setClassId] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const initial: { success: boolean; error: boolean; message?: string } = {
    success: false,
    error: false,
  };
  const [approveState, approve, approving] = useActionState(approveRegistration, initial);
  const [rejectState, reject, rejectingPending] = useActionState(rejectRegistration, initial);

  useEffect(() => {
    if (approveState.success) {
      toast("Registration approved. The student can now sign in.");
      router.refresh();
    }
  }, [approveState, router]);

  useEffect(() => {
    if (rejectState.success) {
      toast("Registration rejected.");
      router.refresh();
    }
  }, [rejectState, router]);

  const openClasses = classes.filter((c) => c.taken < c.capacity);

  return (
    <div className="card p-5 flex flex-col gap-5">
      <h2 className="text-base font-semibold">Review</h2>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() => approve({ id, classId }));
        }}
      >
        <label htmlFor="classId" className="text-xs font-medium text-gray-600">
          Place in class
        </label>
        <select
          id="classId"
          className="form-control"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        >
          <option value="" disabled>
            {openClasses.length ? "Select a class" : "No class in this grade has space"}
          </option>
          {classes.map((c) => (
            <option key={c.id} value={c.id} disabled={c.taken >= c.capacity}>
              {c.name} ({c.taken}/{c.capacity}
              {c.taken >= c.capacity ? ", full" : ""})
            </option>
          ))}
        </select>
        {approveState.error && (
          <p className="text-sm text-red-500">{approveState.message}</p>
        )}
        <button className="btn-primary" disabled={approving || !classId}>
          {approving ? "Approving..." : "Approve and create account"}
        </button>
      </form>

      <div className="border-t border-gray-100 pt-4">
        {!rejecting ? (
          <button
            type="button"
            className="text-sm text-red-600 hover:underline"
            onClick={() => setRejecting(true)}
          >
            Reject this registration
          </button>
        ) : (
          <form action={reject} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={id} />
            <label htmlFor="reason" className="text-xs font-medium text-gray-600">
              Reason <span className="text-gray-400 font-normal">(optional, kept on record)</span>
            </label>
            <textarea id="reason" name="reason" rows={2} className="form-control" />
            {rejectState.error && (
              <p className="text-sm text-red-500">{rejectState.message}</p>
            )}
            <div className="flex gap-3">
              <button
                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
                disabled={rejectingPending}
              >
                {rejectingPending ? "Rejecting..." : "Confirm rejection"}
              </button>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setRejecting(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationReview;
