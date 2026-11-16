"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/authActions";

const SignInForm = ({
  schoolName,
  logoUrl,
  passwordReset,
}: {
  schoolName: string;
  logoUrl: string;
  passwordReset?: boolean;
}) => {
  const [state, formAction, pending] = useActionState(signIn, {});

  return (
    <form
      action={formAction}
      className="card w-full max-w-sm p-8 flex flex-col gap-5"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src={logoUrl} alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />
        <h1 className="text-xl font-semibold text-gray-800">{schoolName}</h1>
        <p className="text-sm text-gray-500">Sign in to your account</p>
      </div>

      {passwordReset && (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Your password has been changed. Sign in with your new password.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-xs font-medium text-gray-500">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          required
          className="form-control"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-medium text-gray-500">
            Password
          </label>
          <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="form-control"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-500">
          {state.error}
        </p>
      )}

      <button className="btn-primary" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-sm text-center text-gray-500">
        New student or parent?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
