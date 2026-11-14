"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type FormDeleteProps = {
  table: string;
  id: number | string;
  deleteAction: (
    currentState: { success: boolean; error: boolean },
    formData: FormData
  ) => Promise<{ success: boolean; error: boolean }>;
  onClose: () => void;
};

const FormDelete = ({ table, id, deleteAction, onClose }: FormDeleteProps) => {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteAction, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state, onClose, router]);

  return (
    <form action={formAction} className="p-4 flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <span className="text-center font-medium">
        All data will be lost. Are you sure you want to delete this {table}?
      </span>
      {state.error && (
        <span className="text-red-500 text-center text-sm">
          Something went wrong!
        </span>
      )}
      <button
        type="submit"
        className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
      >
        Delete
      </button>
    </form>
  );
};

export default FormDelete;
