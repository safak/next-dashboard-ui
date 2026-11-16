"use client";

import { useActionState, useState } from "react";
import { dismissResetRequest, resetPassword, sendTestEmail } from "@/lib/adminActions";

type State = { success: boolean; error: boolean; message?: string };
const initial: State = { success: false, error: false };

export type ResetRequestRow = {
  id: number;
  username: string;
  name: string;
  role: string;
  contact: string | null;
  phone: string | null;
  requestedAt: string;
};

// One "forgot password" request from an account with no email address
const RequestItem = ({ request, onReset }: { request: ResetRequestRow; onReset: () => void }) => {
  const [reset, resetAction, resetting] = useActionState(resetPassword, initial as State & { temporaryPassword?: string });
  const [, dismiss, dismissing] = useActionState(dismissResetRequest, initial);
  const [copied, setCopied] = useState(false);

  return (
    <li className="rounded-lg border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="text-sm">
          <p className="font-medium text-gray-900">
            {request.name} <span className="font-normal text-gray-500">@{request.username} · <span className="capitalize">{request.role}</span></span>
          </p>
          <p className="text-xs text-gray-500">Asked {request.requestedAt}</p>
          {(request.contact || request.phone) && (
            <p className="mt-1 text-gray-700">
              Contact:{" "}
              {[request.contact, request.phone && request.phone !== request.contact ? `${request.phone} (on file)` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        {!reset.success && (
          <div className="flex items-center gap-3">
            <form action={resetAction} onSubmit={onReset}>
              <input type="hidden" name="username" value={request.username} />
              <button className="btn-primary" disabled={resetting}>
                {resetting ? "Resetting..." : "Reset password"}
              </button>
            </form>
            <form action={dismiss}>
              <input type="hidden" name="id" value={request.id} />
              <button className="text-sm text-gray-500 hover:text-gray-700" disabled={dismissing}>
                Dismiss
              </button>
            </form>
          </div>
        )}
      </div>
      {reset.error && <p className="text-sm text-red-500">{reset.message}</p>}
      {reset.success && reset.temporaryPassword && (
        <div role="status" className="rounded-lg bg-lamaYellowLight p-3 text-sm flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span>Temporary password:</span>
            <span className="font-mono text-lg tracking-wider">{reset.temporaryPassword}</span>
            <button
              type="button"
              className="text-xs text-indigo-600 hover:underline"
              onClick={() => navigator.clipboard?.writeText(reset.temporaryPassword!).then(() => setCopied(true))}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-gray-600">Give it to them privately; they choose their own when they sign in.</p>
        </div>
      )}
    </li>
  );
};

export const ResetRequests = ({ requests }: { requests: ResetRequestRow[] }) => {
  // Resetting marks the request handled, so the server drops it from the
  // list; keep it on screen so the temporary password can be read out
  const [resetRows, setResetRows] = useState<ResetRequestRow[]>([]);
  const rows = [...requests, ...resetRows.filter((k) => !requests.some((r) => r.id === k.id))];
  if (rows.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        Waiting for you ({requests.length})
      </h2>
      <ul className="flex flex-col gap-3">
        {rows.map((r) => (
          <RequestItem key={r.id} request={r} onReset={() => setResetRows((rs) => [...rs, r])} />
        ))}
      </ul>
    </div>
  );
};

export const TestEmailForm = () => {
  const [state, action, pending] = useActionState(sendTestEmail, initial);
  return (
    <form action={action} className="flex flex-col gap-2 max-w-md">
      <label htmlFor="test-to" className="text-xs font-medium text-gray-600">Send a test email to</label>
      <div className="flex gap-3">
        <input id="test-to" name="to" type="email" required className="form-control flex-1" placeholder="you@example.com" />
        <button className="btn-primary" disabled={pending}>
          {pending ? "Sending..." : "Send test"}
        </button>
      </div>
      {state.error && <p className="text-sm text-red-500">{state.message}</p>}
      {state.success && <p className="text-sm text-green-600">{state.message}</p>}
    </form>
  );
};
