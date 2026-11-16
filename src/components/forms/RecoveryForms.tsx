"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { resendSignInCode, verifySignInCode } from "@/lib/authActions";
import { requestPasswordReset, resetPasswordWithLink } from "@/lib/recoveryActions";

const label = "text-xs font-medium text-gray-500";

const Heading = ({ title, intro }: { title: string; intro: string }) => (
  <div className="flex flex-col gap-1 text-center">
    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    <p className="text-sm text-gray-500">{intro}</p>
  </div>
);

const ErrorText = ({ error }: { error?: string }) =>
  error ? (
    <p role="alert" className="text-sm text-red-500">
      {error}
    </p>
  ) : null;

export const ForgotPasswordForm = () => {
  const [state, action, pending] = useActionState(requestPasswordReset, {});

  if (state.success) {
    return (
      <div className="card w-full max-w-sm p-8 flex flex-col gap-4">
        <Heading title="Check your email" intro="If that account exists, help is on its way." />
        <div role="status" className="rounded-lg bg-lamaSkyLight p-4 text-sm text-gray-700 flex flex-col gap-2">
          <p>
            <span className="font-medium">Have an email address on your account?</span> We&apos;ve
            sent you a link to choose a new password. It expires in 30 minutes; check your spam
            folder if it doesn&apos;t arrive.
          </p>
          <p>
            <span className="font-medium">No email address?</span> The school office has been
            asked to reset your password and will contact you with a temporary one.
          </p>
        </div>
        <Link href="/sign-in" className="btn-primary text-center">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="card w-full max-w-sm p-8 flex flex-col gap-5">
      <Heading
        title="Forgot your password?"
        intro="Enter your username or email address and we'll help you get back in."
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="login" className={label}>Username or email address</label>
        <input id="login" name="login" autoComplete="username" autoFocus required maxLength={200} className="form-control" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact" className={label}>
          Phone number <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input id="contact" name="contact" type="tel" autoComplete="tel" maxLength={200} className="form-control" />
        <p className="text-xs text-gray-400">
          Only used if your account has no email address, so the office can call you.
        </p>
      </div>
      <ErrorText error={state.error} />
      <button className="btn-primary" disabled={pending}>
        {pending ? "Sending..." : "Reset my password"}
      </button>
      <Link href="/sign-in" className="text-sm text-center text-gray-500 hover:text-gray-700">
        Back to sign in
      </Link>
    </form>
  );
};

export const ResetWithLinkForm = ({ token, username }: { token: string; username: string }) => {
  const [state, action, pending] = useActionState(resetPasswordWithLink, {});

  return (
    <form action={action} className="card w-full max-w-sm p-8 flex flex-col gap-5">
      <Heading title="Choose a new password" intro={`For the account @${username}.`} />
      <input type="hidden" name="token" value={token} />
      {/* Lets password managers save the new password against the account */}
      <input type="hidden" name="username" value={username} autoComplete="username" />
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={label}>New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required autoFocus className="form-control" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className={label}>Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required className="form-control" />
      </div>
      <p className="text-xs text-gray-400 -mt-2">At least 8 characters. You&apos;ll be signed out on all other devices.</p>
      <ErrorText error={state.error} />
      <button className="btn-primary" disabled={pending}>
        {pending ? "Saving..." : "Save new password"}
      </button>
    </form>
  );
};

export const VerifyCodeForm = ({ email }: { email: string }) => {
  const [state, action, pending] = useActionState(verifySignInCode, {});
  const [resent, resend, resending] = useActionState(resendSignInCode, {});
  const [code, setCode] = useState("");

  // A wrong code clears the box for the next try
  useEffect(() => {
    if (state.error) setCode("");
  }, [state]);

  return (
    <div className="card w-full max-w-sm p-8 flex flex-col gap-5">
      <Heading title="Check your email" intro={`We sent a 6-digit sign-in code to ${email}.`} />
      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className={label}>Sign-in code</label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-control text-center font-mono text-2xl tracking-[0.4em]"
          />
        </div>
        <ErrorText error={state.error} />
        <button className="btn-primary" disabled={pending}>
          {pending ? "Checking..." : "Sign in"}
        </button>
      </form>
      <form action={resend} className="flex flex-col items-center gap-1 text-sm">
        <button className="text-indigo-600 hover:underline disabled:opacity-60" disabled={resending}>
          {resending ? "Sending..." : "Send a new code"}
        </button>
        {resent.success && <p className="text-xs text-green-600">A new code is on its way.</p>}
        {resent.error && <p className="text-xs text-red-500">{resent.error}</p>}
      </form>
      <Link href="/sign-in" className="text-sm text-center text-gray-500 hover:text-gray-700">
        Use a different account
      </Link>
    </div>
  );
};
