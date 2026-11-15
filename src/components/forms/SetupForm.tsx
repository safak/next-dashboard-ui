"use client";

import { useActionState } from "react";
import { completeSetup } from "@/lib/setupActions";

const label = "text-xs font-medium text-gray-600";

const SetupForm = () => {
  const [state, action, pending] = useActionState(completeSetup, {});

  return (
    <form action={action} className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="s-school" className={label}>School name</label>
        <input id="s-school" name="schoolName" required maxLength={60} className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-from" className={label}>First grade taught</label>
        <input id="s-from" name="fromGrade" type="number" min={0} max={13} defaultValue={8} required className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-to" className={label}>Last grade taught</label>
        <input id="s-to" name="toGrade" type="number" min={0} max={13} defaultValue={12} required className="form-control" />
      </div>
      <h2 className="sm:col-span-2 mt-2 text-sm font-semibold text-gray-800">Your administrator account</h2>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="s-user" className={label}>Username</label>
        <input id="s-user" name="username" required autoComplete="username" className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-pass" className={label}>Password</label>
        <input id="s-pass" name="password" type="password" required minLength={8} autoComplete="new-password" className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-pass2" className={label}>Confirm password</label>
        <input id="s-pass2" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="form-control" />
      </div>
      {state.error && <p role="alert" className="sm:col-span-2 text-sm text-red-500">{state.error}</p>}
      <button className="btn-primary sm:col-span-2" disabled={pending}>
        {pending ? "Setting up..." : "Create school"}
      </button>
    </form>
  );
};

export default SetupForm;
