"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import { updateStudentFeePlan } from "../actions";

import type { FeeWithRelations } from "../types";

interface EditInstallmentDrawerProps {
  open: boolean;
  fee: FeeWithRelations | null;
  onClose: () => void;
}

function normalizeDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getInstallmentLabel(fee: FeeWithRelations) {
  switch (fee.installment) {
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

function getInstallmentStyles(fee: FeeWithRelations) {
  switch (fee.installment) {
    case "ADMISSION":
      return {
        badge: "bg-violet-100 text-violet-700",
        amount: "text-violet-700",
      };

    case "TERM_1":
      return {
        badge: "bg-blue-100 text-blue-700",
        amount: "text-blue-700",
      };

    case "TERM_2":
      return {
        badge: "bg-orange-100 text-orange-700",
        amount: "text-orange-700",
      };

    default:
      return {
        badge: "bg-slate-100 text-slate-700",
        amount: "text-slate-700",
      };
  }
}

function getStatusLabel(fee: FeeWithRelations) {
  if (fee.status === "PAID" || fee.paidAmount >= fee.totalAmount) {
    return {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (fee.status === "PARTIAL") {
    return {
      label: "Partial",
      className: "bg-blue-50 text-blue-700",
    };
  }

  return {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
  };
}

export default function EditInstallmentDrawer({
  open,
  fee,
  onClose,
}: EditInstallmentDrawerProps) {
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!fee) {
      setDueDate(null);
      return;
    }

    setDueDate(normalizeDate(fee.dueDate));
  }, [fee]);

  if (!fee) {
    return null;
  }

  const installmentLabel = getInstallmentLabel(fee);

  const styles = getInstallmentStyles(fee);

  const status = getStatusLabel(fee);

  const balance = Math.max(Number(fee.totalAmount) - Number(fee.paidAmount), 0);

  const studentName = `${fee.student.name} ${fee.student.surname}`.trim();

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const formattedDueDate = dueDate
        ? `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(
            2,
            "0",
          )}-${String(dueDate.getDate()).padStart(2, "0")}`
        : null;

      const result = await updateStudentFeePlan(
        { success: false },
        {
          id: fee.id,
          dueDate: formattedDueDate,
        },
      );

      if (!result.success) {
        toast.error(result.error ?? "Failed to update installment.");

        return;
      }

      toast.success(`${installmentLabel} updated successfully.`);

      onClose();
    } catch (error) {
      console.error("Update installment error:", error);

      toast.error("Failed to update installment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit Installment"
      description={`Update the ${installmentLabel.toLowerCase()} details.`}
      width="sm"
      icon={<IndianRupee className="h-6 w-6" />}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
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
              <span className="text-xs font-bold">
                {fee.installment === "ADMISSION"
                  ? "₹"
                  : fee.installment === "TERM_1"
                    ? "T1"
                    : "T2"}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {installmentLabel}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {studentName}
              </p>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <div className="p-4">
              <p className="text-xs text-slate-400">Class</p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {fee.student.class?.name ?? "—"}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs text-slate-400">Installment Amount</p>

              <p className={`mt-1 text-sm font-bold ${styles.amount}`}>
                {formatCurrency(fee.totalAmount)}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div>
                <p className="text-xs text-slate-400">Paid</p>

                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  {formatCurrency(fee.paidAmount)}
                </p>
              </div>

              <div className="pl-4">
                <p className="text-xs text-slate-400">Balance</p>

                <p className="mt-1 text-sm font-semibold text-red-600">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Due Date
            <span className="ml-1 font-normal text-slate-400">(Optional)</span>
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="dd MMM yyyy"
              placeholderText="Select due date"
              popperPlacement="bottom-start"
              popperClassName="!z-[9999]"
              wrapperClassName="w-full"
              showPopperArrow={false}
              isClearable
              clearButtonClassName="!text-slate-400"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-xs text-slate-500">
            Change or clear the payment deadline for this installment.
          </p>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3">
          <p className="text-xs font-semibold text-blue-800">
            Only the installment due date will change
          </p>

          <p className="mt-1 text-[11px] leading-4 text-blue-700">
            Payment amounts and payment records are managed separately through
            Record Payment and Payment History.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
