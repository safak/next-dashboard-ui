"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ReceiptText,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

import PayFeeButton from "@/components/PayFeeButton";

type PaymentItem = {
  id: number;
  amount: number;
  paidAt: string;
  mode: string;
  referenceId: string | null;
};

type FeeItem = {
  id: number;
  title: string;
  installment: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  dueDate: string | null;
  receiptNo: string | null;
  createdAt: string;
  payments: PaymentItem[];
};

type Props = {
  fees: FeeItem[];
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  paidFees: number;
  pendingFees: number;
  parentMobile?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
};

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatus(fee: FeeItem) {
  if (fee.dueAmount === 0) {
    return {
      label: "PAID",
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  if (fee.paidAmount > 0) {
    return {
      label: "PARTIAL",
      className: "bg-[#FFF0D6] text-[#B87938]",
    };
  }

  return {
    label: "DUE",
    className: "bg-red-100 text-red-600",
  };
}

export default function ParentFeesClient({
  fees,
  totalAmount,
  totalPaid,
  totalDue,
  paidFees,
  pendingFees,
  parentMobile,
  parentName,
  parentEmail,
}: Props) {
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);

  return (
    <>
      {/* ================= SUMMARY ================= */}

      <section className="mt-6 grid grid-cols-2 gap-2.5">
        <div
          className="
            rounded-[18px]
            bg-[#4B517D]
            px-4
            py-3
            text-white
            shadow-[0_8px_20px_rgba(75,81,125,0.15)]
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/65">Total Fee</p>

              <p className="mt-1 text-[22px] font-extrabold">
                {formatCurrency(totalAmount)}
              </p>

              <p className="mt-0.5 text-[8px] text-white/60">Assigned amount</p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                bg-white/10
              "
            >
              <WalletCards className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div
          className="
            rounded-[18px]
            border
            border-slate-100
            bg-white
            px-4
            py-3
          "
        >
          <p className="text-[9px] text-slate-400">Paid</p>

          <p className="mt-1 text-[22px] font-extrabold text-emerald-600">
            {formatCurrency(totalPaid)}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">Amount paid</p>
        </div>

        <div
          className="
            rounded-[18px]
            border
            border-slate-100
            bg-white
            px-4
            py-3
          "
        >
          <p className="text-[9px] text-slate-400">Pending</p>

          <p
            className={`
              mt-1
              text-[22px]
              font-extrabold
              ${totalDue > 0 ? "text-[#B87938]" : "text-emerald-600"}
            `}
          >
            {formatCurrency(totalDue)}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">Amount due</p>
        </div>

        <div
          className="
            rounded-[18px]
            border
            border-slate-100
            bg-white
            px-4
            py-3
          "
        >
          <p className="text-[9px] text-slate-400">Status</p>

          <p className="mt-1 text-[18px] font-extrabold text-[#4B517D]">
            {paidFees}
            <span className="text-[11px] font-medium text-slate-400">
              {" "}
              / {fees.length}
            </span>
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">Fees paid</p>
        </div>
      </section>

      {/* ================= SECTION TITLE ================= */}

      <div className="mt-7 flex items-end justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-[#4B517D]">Fee Details</h2>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {pendingFees > 0
              ? `${pendingFees} payment${pendingFees === 1 ? "" : "s"} pending`
              : "All fees are paid"}
          </p>
        </div>
      </div>

      {/* ================= FEES ================= */}

      <section className="mt-3 space-y-2.5">
        {fees.length === 0 ? (
          <div
            className="
        rounded-[22px]
        border border-slate-100
        bg-white
        px-5
        py-12
        text-center
        shadow-sm
      "
          >
            <div
              className="
          mx-auto
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-[20px]
          bg-[#EEF2FA]
          text-[#4B517D]
        "
            >
              <IndianRupee className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#4B517D]">
              No fee records
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
              No fees have been assigned to this student yet.
            </p>
          </div>
        ) : (
          [...fees]
            .sort((a, b) => {
              const order: Record<string, number> = {
                "Admission Fee": 1,
                "Term 1 Fee": 2,
                "Term 2 Fee": 3,
              };

              return (
                (order[a.installment] ?? 99) - (order[b.installment] ?? 99)
              );
            })
            .map((fee, index) => {
              const status = getStatus(fee);

              const progress =
                fee.totalAmount > 0
                  ? Math.min(
                      100,
                      Math.round((fee.paidAmount / fee.totalAmount) * 100),
                    )
                  : 0;

              const isPaid = fee.dueAmount === 0;

              const installmentNumber = index + 1;

              return (
                <div
                  key={fee.id}
                  className="
              rounded-[17px]
              border
              border-slate-100
              bg-white
              px-3
              py-2.5
              shadow-[0_3px_12px_rgba(15,23,42,0.045)]
            "
                >
                  <button
                    type="button"
                    onClick={() => setSelectedFee(fee)}
                    className="w-full text-left"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-[11px]
                      bg-[#E7ECF8]
                      text-[#4B517D]
                    "
                        >
                          <IndianRupee className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-[11px] font-extrabold text-slate-900">
                              {fee.installment}
                            </h3>

                            <span
                              className="
                          shrink-0
                          rounded-full
                          bg-[#F3F4F8]
                          px-1.5
                          py-0.5
                          text-[6px]
                          font-bold
                          text-[#4B517D]
                        "
                            >
                              {installmentNumber}/3
                            </span>
                          </div>

                          <p className="truncate text-[7px] text-slate-400">
                            {fee.title}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`
                    shrink-0
                    rounded-full
                    px-2
                    py-0.5
                    text-[6px]
                    font-bold
                    ${status.className}
                  `}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Amount Row */}
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[6px] text-slate-400">Amount</p>

                        <p className="mt-0.5 text-[12px] font-extrabold text-[#4B517D]">
                          {formatCurrency(fee.totalAmount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[6px] text-slate-400">Paid</p>

                        <p className="mt-0.5 text-[10px] font-extrabold text-emerald-600">
                          {formatCurrency(fee.paidAmount)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[6px] text-slate-400">Balance</p>

                        <p
                          className={`
                      mt-0.5
                      text-[10px]
                      font-extrabold
                      ${
                        fee.dueAmount > 0
                          ? "text-[#B87938]"
                          : "text-emerald-600"
                      }
                    `}
                        >
                          {formatCurrency(fee.dueAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[6px] text-slate-400">
                          Payment progress
                        </p>

                        <p className="text-[6px] font-bold text-[#4B517D]">
                          {progress}%
                        </p>
                      </div>

                      <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`
                      h-full
                      rounded-full
                      ${isPaid ? "bg-emerald-500" : "bg-[#4B517D]"}
                    `}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Due Date - only for unpaid fees */}
                    {!isPaid && (
                      <div className="mt-1.5 flex items-center justify-between">
                        <p className="text-[6px] text-slate-400">Due Date</p>

                        <p className="text-[7px] font-bold text-[#4B517D]">
                          {formatDate(fee.dueDate)}
                        </p>
                      </div>
                    )}
                  </button>

                  {/* Payment Action */}
                  {!isPaid && (
                    <div className="mt-2 border-t border-slate-100 pt-2">
                      <PayFeeButton
                        amount={fee.dueAmount}
                        studentFeeId={fee.id}
                        parentMobile={parentMobile}
                        parentName={parentName}
                        parentEmail={parentEmail}
                      />
                    </div>
                  )}

                  {/* Paid State */}
                  {isPaid && (
                    <div className="mt-2 border-t border-emerald-100 pt-2">
                      <div
                        className="
                    flex
                    items-center
                    justify-between
                    rounded-[10px]
                    bg-emerald-50
                    px-2.5
                    py-1.5
                  "
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />

                          <p className="text-[7px] font-bold text-emerald-700">
                            Payment completed
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedFee(fee)}
                          className="
                      text-[7px]
                      font-bold
                      text-[#4B517D]
                    "
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </section>

      {/* ================= PAYMENT HISTORY ================= */}

      {fees.some((fee) => fee.payments.length > 0) && (
        <section className="mt-5">
          <div className="mb-2.5">
            <h2 className="text-[17px] font-bold text-[#4B517D]">
              Payment History
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-400">
              Recent transactions
            </p>
          </div>

          <div className="space-y-2">
            {fees
              .flatMap((fee) =>
                fee.payments.map((payment) => ({
                  ...payment,
                  feeTitle: fee.installment,
                  feeStructureTitle: fee.title,
                })),
              )
              .sort(
                (a, b) =>
                  new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
              )
              .map((payment) => (
                <div
                  key={payment.id}
                  className="
              flex
              items-center
              gap-2.5
              rounded-[16px]
              border
              border-slate-100
              bg-white
              px-3
              py-2.5
            "
                >
                  <div
                    className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[12px]
                bg-emerald-50
                text-emerald-600
              "
                  >
                    <ReceiptText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-extrabold text-slate-800">
                      {payment.feeTitle}
                    </p>

                    <p className="mt-0.5 truncate text-[8px] text-slate-400">
                      {payment.feeStructureTitle}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-[7px] text-slate-400">
                        {formatDate(payment.paidAt)}
                      </span>

                      <span className="text-[7px] text-slate-300">•</span>

                      <span className="text-[7px] font-semibold uppercase text-slate-400">
                        {payment.mode.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <p className="shrink-0 text-[11px] font-extrabold text-emerald-600">
                    +{formatCurrency(payment.amount)}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ================= FEE DETAILS SHEET ================= */}

      {selectedFee && (
        <>
          <button
            type="button"
            aria-label="Close fee details"
            onClick={() => setSelectedFee(null)}
            className="
              fixed
              inset-0
              z-[80]
              bg-black/25
              backdrop-blur-[2px]
            "
          />

          <div
            className="
              fixed
              bottom-0
              left-1/2
              z-[90]
              w-full
              max-w-[430px]
              -translate-x-1/2
              rounded-t-[28px]
              bg-white
              px-5
              pb-7
              pt-3
              shadow-[0_-10px_40px_rgba(15,23,42,0.18)]
            "
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />

            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-[17px]
                    bg-[#E7ECF8]
                    text-[#4B517D]
                  "
                >
                  <IndianRupee className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#F59A23]">
                    Fee Details
                  </p>

                  <h3 className="mt-0.5 truncate text-[17px] font-extrabold text-slate-900">
                    {selectedFee.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFee(null)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-50
                  text-slate-500
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className="
                mt-5
                rounded-[22px]
                bg-[#4B517D]
                p-5
                text-white
              "
            >
              <p className="text-[9px] uppercase tracking-wide text-white/60">
                Outstanding Balance
              </p>

              <p className="mt-1 text-[31px] font-extrabold">
                {formatCurrency(selectedFee.dueAmount)}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[8px] text-white/50">Total</p>

                  <p className="mt-0.5 text-[11px] font-bold">
                    {formatCurrency(selectedFee.totalAmount)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[8px] text-white/50">Paid</p>

                  <p className="mt-0.5 text-[11px] font-bold">
                    {formatCurrency(selectedFee.paidAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-[17px] bg-[#EEF2FA] p-3">
                <p className="text-[8px] text-slate-400">Due Date</p>

                <div className="mt-1 flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#4B517D]" />

                  <p className="text-[9px] font-bold text-[#4B517D]">
                    {formatDate(selectedFee.dueDate)}
                  </p>
                </div>
              </div>

              <div className="rounded-[17px] bg-emerald-50 p-3">
                <p className="text-[8px] text-slate-400">Status</p>

                <div className="mt-1 flex items-center gap-1.5">
                  {selectedFee.dueAmount === 0 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5 text-[#B87938]" />
                  )}

                  <p className="text-[9px] font-bold text-slate-700">
                    {selectedFee.dueAmount === 0
                      ? "Paid"
                      : selectedFee.paidAmount > 0
                        ? "Partial"
                        : "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {selectedFee.receiptNo && (
              <div className="mt-3 rounded-[17px] bg-[#F7F8FA] p-3">
                <p className="text-[8px] text-slate-400">Receipt Number</p>

                <p className="mt-1 text-[10px] font-bold text-slate-700">
                  {selectedFee.receiptNo}
                </p>
              </div>
            )}

            {selectedFee.payments.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-bold text-[#4B517D]">
                  Payments
                </p>

                <div className="max-h-32 space-y-2 overflow-y-auto">
                  {selectedFee.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="
                          flex
                          items-center
                          justify-between
                          rounded-[14px]
                          bg-[#F7F8FA]
                          px-3
                          py-2.5
                        "
                    >
                      <div>
                        <p className="text-[9px] font-semibold text-slate-600">
                          {formatDate(payment.paidAt)}
                        </p>

                        <p className="mt-0.5 text-[8px] text-slate-400">
                          {payment.mode.replace("_", " ")}
                        </p>
                      </div>

                      <p className="text-[10px] font-bold text-emerald-600">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFee.dueAmount > 0 && (
              <div className="mt-4">
                <PayFeeButton
                  amount={selectedFee.dueAmount}
                  studentFeeId={selectedFee.id}
                  parentMobile={parentMobile}
                  parentName={parentName}
                  parentEmail={parentEmail}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
