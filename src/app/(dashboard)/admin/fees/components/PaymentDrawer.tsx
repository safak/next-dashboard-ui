"use client";

import { useState } from "react";
import { Banknote, CreditCard, IndianRupee, Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import type { PaymentMode } from "@prisma/client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import { createPayment } from "../actions";
import type { FeeWithRelations } from "../types";

interface PaymentDrawerProps {
  open: boolean;
  fee: FeeWithRelations | null;
  onClose: () => void;
}

const paymentModeOptions = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "UPI",
    label: "UPI",
  },
  {
    value: "CARD",
    label: "Card",
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
  },
] as const;

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function getInstallmentLabel(installment: FeeWithRelations["installment"]) {
  switch (installment) {
    case "ADMISSION":
      return "Admission Fee";

    case "TERM_1":
      return "Term 1";

    case "TERM_2":
      return "Term 2";

    default:
      return "Installment";
  }
}

function getInstallmentStyles(installment: FeeWithRelations["installment"]) {
  switch (installment) {
    case "ADMISSION":
      return {
        badge: "bg-violet-100 text-violet-700",
        amount: "text-violet-700",
        icon: "₹",
      };

    case "TERM_1":
      return {
        badge: "bg-blue-100 text-blue-700",
        amount: "text-blue-700",
        icon: "T1",
      };

    case "TERM_2":
      return {
        badge: "bg-orange-100 text-orange-700",
        amount: "text-orange-700",
        icon: "T2",
      };

    default:
      return {
        badge: "bg-slate-100 text-slate-700",
        amount: "text-slate-700",
        icon: "₹",
      };
  }
}

function getPaymentModeIcon(mode: string) {
  switch (mode) {
    case "CASH":
      return <Banknote className="h-4 w-4" />;

    case "UPI":
      return <Smartphone className="h-4 w-4" />;

    case "CARD":
      return <CreditCard className="h-4 w-4" />;

    case "BANK_TRANSFER":
      return <Banknote className="h-4 w-4" />;

    default:
      return <IndianRupee className="h-4 w-4" />;
  }
}

export default function PaymentDrawer({
  open,
  fee,
  onClose,
}: PaymentDrawerProps) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("CASH");
  const [referenceId, setReferenceId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!fee) {
    return null;
  }

  const installmentLabel = getInstallmentLabel(fee.installment);

  const styles = getInstallmentStyles(fee.installment);

  const totalAmount = Number(fee.totalAmount || 0);

  const paidAmount = Number(fee.paidAmount || 0);

  const balance = Math.max(totalAmount - paidAmount, 0);

  const enteredAmount = Number(amount) || 0;

  const remainingAfterPayment = Math.max(balance - enteredAmount, 0);

  const studentName = `${fee.student.name} ${fee.student.surname}`.trim();

  const isValidAmount = enteredAmount > 0 && enteredAmount <= balance;

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    setAmount("");
    setMode("CASH");
    setReferenceId("");

    onClose();
  };

  const handleSave = async () => {
    if (!amount) {
      toast.error("Please enter the payment amount.");
      return;
    }

    if (enteredAmount <= 0) {
      toast.error("Payment amount must be greater than zero.");
      return;
    }

    if (enteredAmount > balance) {
      toast.error(
        `Payment cannot exceed the remaining balance of ${formatCurrency(balance)}.`,
      );
      return;
    }

    setIsSaving(true);

    try {
      const result = await createPayment({
        studentFeeId: fee.id,
        amount: enteredAmount,
        mode,
        referenceId: referenceId.trim() || undefined,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to record payment.");

        return;
      }

      toast.success(`${installmentLabel} payment recorded successfully.`);

      handleClose();
    } catch (error) {
      console.error("Record payment error:", error);

      toast.error("Failed to record payment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayFullBalance = () => {
    setAmount(String(balance));
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Record Payment"
      description={`Record a payment for the ${installmentLabel.toLowerCase()}.`}
      width="md"
      icon={<IndianRupee className="h-6 w-6" />}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isValidAmount}
          >
            {isSaving ? "Saving..." : "Record Payment"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.badge}`}
            >
              <span className="text-xs font-bold">{styles.icon}</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {installmentLabel}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {studentName}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {fee.student.class?.name ?? "—"}
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
              {fee.status === "PARTIAL" ? "Partial" : "Pending"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="p-3">
              <p className="text-[11px] text-slate-400">Amount</p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="p-3">
              <p className="text-[11px] text-slate-400">Paid</p>

              <p className="mt-1 text-sm font-bold text-emerald-600">
                {formatCurrency(paidAmount)}
              </p>
            </div>

            <div className="p-3">
              <p className="text-[11px] text-slate-400">Balance</p>

              <p className="mt-1 text-sm font-bold text-red-600">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="payment-amount"
              className="text-sm font-medium text-slate-700"
            >
              Payment Amount
            </label>

            <button
              type="button"
              onClick={handlePayFullBalance}
              disabled={balance <= 0}
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              Pay Full Balance
            </button>
          </div>

          <div className="relative">
            <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="payment-amount"
              type="number"
              min={1}
              max={balance}
              step={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter payment amount"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {enteredAmount > balance && (
            <p className="text-xs font-medium text-red-600">
              Payment cannot exceed {formatCurrency(balance)}.
            </p>
          )}

          {enteredAmount > 0 && enteredAmount <= balance && (
            <p className="text-xs text-slate-500">
              Remaining balance after payment:{" "}
              <span className="font-semibold text-slate-700">
                {formatCurrency(remainingAfterPayment)}
              </span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Payment Mode
          </label>

          <RadixSelect
            value={mode}
            onChange={(value) => setMode(value as PaymentMode)}
            placeholder="Select payment mode"
            options={paymentModeOptions}
          />

          <div className="flex items-center gap-2 text-xs text-slate-500">
            {getPaymentModeIcon(mode)}
            <span>
              Payment will be recorded as{" "}
              <span className="font-medium text-slate-700">
                {
                  paymentModeOptions.find((option) => option.value === mode)
                    ?.label
                }
              </span>
              .
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reference-id"
            className="text-sm font-medium text-slate-700"
          >
            Reference ID{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>

          <input
            id="reference-id"
            type="text"
            value={referenceId}
            onChange={(event) => setReferenceId(event.target.value)}
            placeholder="UPI / transaction / cheque reference"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="text-xs text-slate-500">
            Useful for UPI, bank transfer or other traceable payments.
          </p>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3">
          <p className="text-xs font-semibold text-emerald-800">
            Payment will update this installment
          </p>

          <p className="mt-1 text-[11px] leading-4 text-emerald-700">
            The payment record will be saved and the installment balance and
            status will update automatically.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
