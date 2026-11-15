"use client";

import { useActionState, useState } from "react";
import { resetPassword } from "@/lib/adminActions";

// Admins reset a forgotten password and read the temporary one to the user
const ResetPasswordForm = () => {
  const [state, action, pending] = useActionState(resetPassword, {
    success: false,
    error: false,
  });
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex flex-col gap-1.5 flex-1 max-w-xs">
          <label htmlFor="reset-username" className="text-xs font-medium text-gray-600">
            Username
          </label>
          <input id="reset-username" name="username" required className="form-control" autoComplete="off" />
        </div>
        <button className="btn-primary" disabled={pending}>
          {pending ? "Resetting..." : "Reset password"}
        </button>
      </form>
      {state.error && <p className="text-sm text-red-500">{state.message}</p>}
      {state.success && state.temporaryPassword && (
        <div role="status" className="rounded-lg bg-lamaYellowLight p-4 text-sm flex flex-col gap-2">
          <p>
            Temporary password for <span className="font-medium">@{state.username}</span>:
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg tracking-wider">{state.temporaryPassword}</span>
            <button
              type="button"
              className="text-xs text-indigo-600 hover:underline"
              onClick={() =>
                navigator.clipboard?.writeText(state.temporaryPassword!).then(() => setCopied(true))
              }
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-gray-600">
            Give it to them privately. They&apos;ve been signed out everywhere and
            must choose their own password when they sign in. It won&apos;t be shown again.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
