"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteEnquiry, updateEnquiryStatus } from "@/lib/websiteActions";

type Status = "NEW" | "CONTACTED" | "CLOSED";
const initial = { success: false, error: false } as { success: boolean; error: boolean; message?: string };

// Status picker and delete for one enquiry
const EnquiryActions = ({ id, status }: { id: number; status: Status }) => {
  const router = useRouter();
  const [statusState, setStatus, saving] = useActionState(updateEnquiryStatus, initial);
  const [deleteState, remove, deleting] = useActionState(deleteEnquiry, initial);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (statusState.success) router.refresh();
    if (statusState.error) toast.error(statusState.message);
  }, [statusState, router]);
  useEffect(() => {
    if (deleteState.success) {
      toast("Enquiry deleted.");
      router.refresh();
    }
  }, [deleteState, router]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Status"
        value={status}
        disabled={saving}
        onChange={(e) => startTransition(() => setStatus({ id, status: e.target.value as Status }))}
        className="form-control py-1 w-auto text-xs"
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CLOSED">Closed</option>
      </select>
      {confirming ? (
        <form action={remove} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <button disabled={deleting} className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
            {deleting ? "..." : "Delete"}
          </button>
          <button type="button" className="text-xs text-gray-500" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="text-xs text-red-600 hover:underline">
          Delete
        </button>
      )}
    </div>
  );
};

export default EnquiryActions;
