"use client";

import { setExtraClassRegistration } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

type State = { success: boolean; error: boolean; message?: string };

// Register / unregister one student for one extra class
const ExtraClassRegisterButton = ({
  extraClassId,
  studentId,
  registered,
  full,
  label,
}: {
  extraClassId: number;
  studentId: string;
  registered: boolean;
  full: boolean;
  label?: string; // e.g. "Remove" on the roster page
}) => {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    State,
    { extraClassId: number; studentId: string; register: boolean }
  >(setExtraClassRegistration, { success: false, error: false });
  const lastRequest = useRef<boolean | null>(null);

  useEffect(() => {
    if (state.success && lastRequest.current !== null) {
      toast(lastRequest.current ? "Registered!" : "Registration removed.");
      lastRequest.current = null;
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router]);

  const toggle = () => {
    lastRequest.current = !registered;
    startTransition(() =>
      action({ extraClassId, studentId, register: !registered })
    );
  };

  if (!registered && full) {
    return (
      <span className="inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400">
        Full
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
        registered
          ? "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
      }`}
    >
      {pending ? "..." : label ?? (registered ? "Unregister" : "Register")}
    </button>
  );
};

export default ExtraClassRegisterButton;
