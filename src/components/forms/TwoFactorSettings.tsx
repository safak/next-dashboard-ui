"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  confirmEmailCode,
  disableTwoFactor,
  resendProfileCode,
  startEmailCode,
  type EmailCodeState,
} from "@/lib/twoFactorActions";

type Flow = "EMAIL" | "ENABLE" | "DISABLE" | null;

const label = "text-xs font-medium text-gray-500";
const linkButton = "text-sm font-medium text-indigo-600 hover:underline";

// Step 1: the address and current password; step 2: the emailed code
const ConfirmEmailFlow = ({
  mode,
  currentEmail,
  onDone,
  onCancel,
}: {
  mode: "EMAIL" | "ENABLE";
  currentEmail: string | null;
  onDone: () => void;
  onCancel: () => void;
}) => {
  const [started, start, starting] = useActionState(startEmailCode, {} as EmailCodeState);
  const [confirmed, confirm, confirming] = useActionState(confirmEmailCode, {} as EmailCodeState);
  const [resent, resend, resending] = useActionState(resendProfileCode, {} as EmailCodeState);

  const [step, setStep] = useState<"details" | "code">("details");
  const [problem, setProblem] = useState<string>();

  useEffect(() => {
    setProblem(started.error);
    if (started.sent) setStep("code");
  }, [started]);
  useEffect(() => {
    if (confirmed.done) onDone();
    // The code is gone (expired, or the address is taken): start over
    if (confirmed.error && !confirmed.sent) {
      setProblem(confirmed.error);
      setStep("details");
    }
  }, [confirmed, onDone]);

  const sentTo = started.email;

  if (step === "details") {
    return (
      <form action={start} className="flex flex-col gap-3 max-w-sm">
        <input type="hidden" name="mode" value={mode} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tf-email" className={label}>Email address</label>
          <input id="tf-email" name="email" type="email" required maxLength={200} defaultValue={currentEmail ?? ""} autoComplete="email" className="form-control" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tf-password" className={label}>Your password</label>
          <input id="tf-password" name="password" type="password" required autoComplete="current-password" className="form-control" />
        </div>
        {problem && <p className="text-sm text-red-500">{problem}</p>}
        <div className="flex items-center gap-4">
          <button className="btn-primary" disabled={starting}>
            {starting ? "Sending..." : "Email me a code"}
          </button>
          <button type="button" className="text-sm text-gray-500" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <p className="text-sm text-gray-600">
        We sent a 6-digit code to <span className="font-medium">{sentTo}</span>. Enter it to{" "}
        {mode === "ENABLE" ? "switch on two-step sign-in" : "save this address"}.
      </p>
      <form action={confirm} className="flex flex-col gap-3">
        <input type="hidden" name="mode" value={mode} />
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
          autoFocus
          aria-label="Code from the email"
          className="form-control text-center font-mono text-xl tracking-[0.4em]"
        />
        {confirmed.error && confirmed.sent && <p className="text-sm text-red-500">{confirmed.error}</p>}
        <div className="flex items-center gap-4">
          <button className="btn-primary" disabled={confirming}>
            {confirming ? "Checking..." : "Confirm"}
          </button>
          <button type="button" className="text-sm text-gray-500" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <form action={resend}>
        <input type="hidden" name="mode" value={mode} />
        <button className="text-xs text-indigo-600 hover:underline disabled:opacity-60" disabled={resending}>
          {resending ? "Sending..." : "Send a new code"}
        </button>
        {resent.error && <p className="text-xs text-red-500">{resent.error}</p>}
        {resent.sent && !resent.error && <p className="text-xs text-green-600">A new code is on its way.</p>}
      </form>
    </div>
  );
};

const DisableFlow = ({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) => {
  const [state, action, pending] = useActionState(disableTwoFactor, {} as EmailCodeState);
  useEffect(() => {
    if (state.done) onDone();
  }, [state, onDone]);

  return (
    <form action={action} className="flex flex-col gap-3 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tf-off-password" className={label}>Your password</label>
        <input id="tf-off-password" name="password" type="password" required autoComplete="current-password" className="form-control" />
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60" disabled={pending}>
          {pending ? "Switching off..." : "Switch off two-step sign-in"}
        </button>
        <button type="button" className="text-sm text-gray-500" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const TwoFactorSettings = ({
  email,
  enabled,
  emailReady,
}: {
  email: string | null;
  enabled: boolean;
  emailReady: boolean;
}) => {
  const [flow, setFlow] = useState<Flow>(null);
  // Each flow starts fresh, even after a previous one finished
  const [run, setRun] = useState(0);
  const open = (f: Flow) => {
    setRun((n) => n + 1);
    setFlow(f);
  };
  const finish = (message: string) => () => {
    setFlow(null);
    toast(message);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className={label}>Email address</p>
            <p className="text-sm text-gray-800">{email ?? <span className="text-gray-400">None yet</span>}</p>
          </div>
          {emailReady && flow === null && (
            <button type="button" className={linkButton} onClick={() => open("EMAIL")}>
              {email ? "Change" : "Add email"}
            </button>
          )}
        </div>
        {flow === "EMAIL" && (
          <ConfirmEmailFlow key={run} mode="EMAIL" currentEmail={email} onDone={finish("Email address saved.")} onCancel={() => setFlow(null)} />
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className={label}>Two-step sign-in</p>
            <p className="text-sm text-gray-800">
              {enabled ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> On: a code is emailed each time you sign in
                </span>
              ) : (
                "Off"
              )}
            </p>
          </div>
          {flow === null &&
            (enabled ? (
              <button type="button" className={linkButton} onClick={() => open("DISABLE")}>
                Switch off
              </button>
            ) : (
              emailReady && (
                <button type="button" className={linkButton} onClick={() => open("ENABLE")}>
                  Switch on
                </button>
              )
            ))}
        </div>
        {flow === "ENABLE" && (
          <ConfirmEmailFlow key={run} mode="ENABLE" currentEmail={email} onDone={finish("Two-step sign-in is on.")} onCancel={() => setFlow(null)} />
        )}
        {flow === "DISABLE" && (
          <DisableFlow key={run} onDone={finish("Two-step sign-in is off.")} onCancel={() => setFlow(null)} />
        )}
      </div>

      {!emailReady && (
        <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
          The school hasn&apos;t set up email sending yet, so email addresses can&apos;t be
          confirmed and two-step sign-in can&apos;t be switched on. Ask an admin.
        </p>
      )}
    </div>
  );
};

export default TwoFactorSettings;
