"use client";

import { startTransition, useActionState } from "react";
import { submitEnquiry } from "@/lib/websiteActions";

const field = "flex flex-col gap-1.5";
const label = "text-sm font-medium text-gray-700";
const input =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand)_25%,white)]";

// Contact form for parents (GENERAL) or demo request for schools
const EnquiryForm = ({ kind }: { kind: "GENERAL" | "SCHOOL_DEMO" }) => {
  const [state, action, pending] = useActionState(submitEnquiry, { success: false, error: false });
  const forSchool = kind === "SCHOOL_DEMO";

  if (state.success) {
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <p className="font-semibold text-green-800">Thank you, we&apos;ve received your message.</p>
        <p className="mt-1 text-sm text-green-700">
          {forSchool
            ? "We'll be in touch to arrange a demo and talk through what your school needs."
            : "We'll get back to you as soon as we can, usually within one working day."}
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const get = (k: string) => String(f.get(k) ?? "");
        startTransition(() =>
          action({
            kind,
            name: get("name"),
            email: get("email"),
            phone: get("phone"),
            organisation: get("organisation"),
            role: get("role"),
            learners: get("learners"),
            message: get("message"),
            website: get("website"),
          })
        );
      }}
    >
      <div className={field}>
        <label htmlFor="e-name" className={label}>Your name</label>
        <input id="e-name" name="name" required autoComplete="name" className={input} />
      </div>
      <div className={field}>
        <label htmlFor="e-email" className={label}>Email</label>
        <input id="e-email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div className={field}>
        <label htmlFor="e-phone" className={label}>
          Phone <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input id="e-phone" name="phone" type="tel" autoComplete="tel" className={input} />
      </div>
      {forSchool ? (
        <>
          <div className={field}>
            <label htmlFor="e-org" className={label}>School or organisation</label>
            <input id="e-org" name="organisation" required className={input} />
          </div>
          <div className={field}>
            <label htmlFor="e-role" className={label}>
              Your role <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input id="e-role" name="role" placeholder="e.g. Principal, Administrator" className={input} />
          </div>
          <div className={field}>
            <label htmlFor="e-learners" className={label}>
              Number of learners <span className="font-normal text-gray-400">(approx.)</span>
            </label>
            <input id="e-learners" name="learners" type="number" min={1} className={input} />
          </div>
        </>
      ) : (
        <div className={field}>
          <label htmlFor="e-role" className={label}>
            I am a… <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <select id="e-role" name="role" className={input} defaultValue="">
            <option value="">Choose</option>
            <option>Parent or guardian</option>
            <option>Learner</option>
            <option>Other</option>
          </select>
        </div>
      )}
      <div className={`${field} sm:col-span-2`}>
        <label htmlFor="e-message" className={label}>
          {forSchool ? "What would you like the system to do for your school?" : "Message"}
        </label>
        <textarea id="e-message" name="message" required minLength={5} rows={5} className={input} />
      </div>
      {/* Hidden from people; bots fill it in and are ignored */}
      <div aria-hidden className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <label htmlFor="e-website">Website</label>
        <input id="e-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.error && <p role="alert" className="sm:col-span-2 text-sm text-red-600">{state.message}</p>}
      <button
        disabled={pending}
        className="sm:col-span-2 justify-self-start rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Sending..." : forSchool ? "Request a demo" : "Send message"}
      </button>
    </form>
  );
};

export default EnquiryForm;
