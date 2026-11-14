"use client";

import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";

type ActionState = { success: boolean; error: boolean; message?: string };

// Shared submit/refresh/toast handling for the create & update forms
export const useFormAction = <T,>(
  action: (state: ActionState, data: T) => Promise<ActionState>,
  {
    entity,
    type,
    setOpen,
  }: {
    entity: string;
    type: "create" | "update";
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const [state, formAction, pending] = useActionState(action, {
    success: false,
    error: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`${entity} has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen, entity]);

  const submit = (data: T) => startTransition(() => formAction(data));

  return {
    submit,
    pending,
    errorMessage: state.error ? state.message || "Something went wrong!" : null,
  };
};
