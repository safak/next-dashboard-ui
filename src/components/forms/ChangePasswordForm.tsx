"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { changePassword } from "@/lib/authActions";

const fields = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "newPassword", label: "New password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
];

const ChangePasswordForm = () => {
  const [state, formAction, pending] = useActionState(changePassword, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast("Your password has been changed!");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4 max-w-sm">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col gap-2">
          <label htmlFor={f.name} className="text-xs font-medium text-gray-500">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type="password"
            autoComplete={f.autoComplete}
            required
            className="form-control"
          />
        </div>
      ))}
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button className="btn-primary self-start" disabled={pending}>
        {pending ? "Saving..." : "Change password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
