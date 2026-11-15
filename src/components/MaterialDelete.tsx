"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteMaterial } from "@/lib/materialActions";

const MaterialDelete = ({ id, title }: { id: number; title: string }) => {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(deleteMaterial, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.success) toast("Material deleted.");
    if (state.error) toast.error(state.message ?? "Couldn't delete the material.");
  }, [state]);

  if (!confirming) {
    return (
      <button
        type="button"
        title={`Delete ${title}`}
        onClick={() => setConfirming(true)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple transition hover:brightness-95"
      >
        <Image src="/delete.png" alt="" width={16} height={16} />
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      <button type="button" className="text-xs text-gray-500" onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </form>
  );
};

export default MaterialDelete;
