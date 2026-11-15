"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteInvoice,
  deletePayment,
  generateMonthlyInvoices,
  recordPayment,
  updateFeeSettings,
} from "@/lib/feeActions";

type State = { success: boolean; error: boolean; message?: string };
const initial: State = { success: false, error: false };
const label = "text-xs font-medium text-gray-600";

const useDone = (state: State, message: string | ((s: State) => string), after?: () => void) => {
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(typeof message === "function" ? message(state) : message);
      after?.();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router]);
};

export const GenerateInvoicesForm = ({ months }: { months: { value: string; label: string }[] }) => {
  const [period, setPeriod] = useState(months[1]?.value ?? months[0].value);
  const [state, action, pending] = useActionState(generateMonthlyInvoices, initial);
  useDone(state, (s) => s.message ?? "Invoices created.");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => action({ period }));
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="period" className={label}>Month</label>
          <select id="period" className="form-control" value={period} onChange={(e) => setPeriod(e.target.value)}>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary" disabled={pending}>
          {pending ? "Creating..." : "Create invoices"}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Bills every learner with subjects for the month, from the fee rates. Learners
        already invoiced for that month are skipped, so it&apos;s safe to run again.
      </p>
      {state.error && <p className="text-sm text-red-500">{state.message}</p>}
      {state.success && state.message && <p className="text-sm text-green-700">{state.message}</p>}
    </form>
  );
};

export const RecordPaymentForm = ({ studentId }: { studentId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(recordPayment, initial);
  useDone(state, "Payment recorded.", () => formRef.current?.reset());
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      ref={formRef}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        startTransition(() =>
          action({
            studentId,
            amount: String(f.get("amount")),
            paidOn: String(f.get("paidOn")),
            method: String(f.get("method")) as "EFT",
            reference: String(f.get("reference") ?? ""),
          })
        );
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount" className={label}>Amount (R)</label>
        <input id="amount" name="amount" required inputMode="decimal" placeholder="450.00" className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="paidOn" className={label}>Date paid</label>
        <input id="paidOn" name="paidOn" type="date" required defaultValue={today} max={today} className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="method" className={label}>Method</label>
        <select id="method" name="method" className="form-control" defaultValue="EFT">
          <option value="EFT">EFT / bank transfer</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reference" className={label}>
          Reference <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input id="reference" name="reference" maxLength={100} className="form-control" placeholder="e.g. bank reference or receipt no." />
      </div>
      {state.error && <p className="sm:col-span-2 text-sm text-red-500">{state.message}</p>}
      <button className="btn-primary sm:col-span-2 justify-self-start" disabled={pending}>
        {pending ? "Saving..." : "Record payment"}
      </button>
    </form>
  );
};

// Delete with an inline "are you sure" step
export const FeeDeleteButton = ({
  kind,
  id,
  what,
}: {
  kind: "invoice" | "payment";
  id: number;
  what: string;
}) => {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(
    kind === "invoice" ? deleteInvoice : deletePayment,
    initial
  );
  useDone(state, `${kind === "invoice" ? "Invoice" : "Payment"} deleted.`);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="text-xs text-red-600 hover:underline">
        Delete
      </button>
    );
  }
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        title={`Delete ${what}`}
        disabled={pending}
        className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
      >
        {pending ? "..." : "Confirm"}
      </button>
      <button type="button" className="text-xs text-gray-500" onClick={() => setConfirming(false)}>
        Cancel
      </button>
      {state.error && <span className="text-xs text-red-500">{state.message}</span>}
    </form>
  );
};

export const FeeSettingsForm = ({
  values,
}: {
  values: { registrationFee: string; siblingDiscountPercent: number; paymentDueDay: number; bankDetails: string };
}) => {
  const [state, action, pending] = useActionState(updateFeeSettings, initial);
  useDone(state, "Fee settings saved.");

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        startTransition(() =>
          action({
            registrationFee: String(f.get("registrationFee") ?? ""),
            siblingDiscountPercent: String(f.get("siblingDiscountPercent")),
            paymentDueDay: String(f.get("paymentDueDay")),
            bankDetails: String(f.get("bankDetails") ?? ""),
          })
        );
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="registrationFee" className={label}>Registration fee (R, once-off)</label>
        <input id="registrationFee" name="registrationFee" inputMode="decimal" defaultValue={values.registrationFee} placeholder="0 = none" className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="siblingDiscountPercent" className={label}>Sibling discount (%)</label>
        <input id="siblingDiscountPercent" name="siblingDiscountPercent" type="number" min={0} max={100} defaultValue={values.siblingDiscountPercent} className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="paymentDueDay" className={label}>Monthly fees due on day</label>
        <input id="paymentDueDay" name="paymentDueDay" type="number" min={1} max={28} defaultValue={values.paymentDueDay} className="form-control" />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-3">
        <label htmlFor="bankDetails" className={label}>Banking details (printed on invoices and statements)</label>
        <textarea
          id="bankDetails"
          name="bankDetails"
          rows={4}
          defaultValue={values.bankDetails}
          className="form-control font-mono text-xs"
          placeholder={"Bank: ...\nAccount name: Capital Mathematics Studies\nAccount number: ...\nBranch code: ..."}
        />
      </div>
      <p className="sm:col-span-3 text-xs text-gray-500">
        The sibling discount applies to the second and later children of the same parent
        (in the order they joined). The registration fee is invoiced when a registration
        is approved.
      </p>
      {state.error && <p className="sm:col-span-3 text-sm text-red-500">{state.message}</p>}
      <button className="btn-primary justify-self-start" disabled={pending}>
        {pending ? "Saving..." : "Save fee settings"}
      </button>
    </form>
  );
};
