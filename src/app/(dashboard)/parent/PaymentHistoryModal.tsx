"use client";

import { useState } from "react";

type Payment = {
  id: number;
  amount: number;
  paidAt: Date;
};

type Fee = {
  id: number;
  title: string;
  totalAmount: number;
  payments: Payment[];
};

export default function PaymentHistoryModal({
  fees,
}: {
  fees: Fee[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-purple-600 hover:underline"
      >
        View History
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-[95%] sm:w-[550px] max-h-[85vh] overflow-hidden shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-base font-semibold">
                Payment History
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[65vh]">

              {fees.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-8">
                  No payments available.
                </div>
              )}

              {fees.map((fee) => (
                <div key={fee.id}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">
                      {fee.title}
                    </h4>
                    <span className="text-xs text-gray-400">
                      Total ₹{fee.totalAmount}
                    </span>
                  </div>

                  {fee.payments.length === 0 ? (
                    <div className="text-xs text-gray-400 italic">
                      No payments made.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {fee.payments.map((p) => (
                        <div
                          key={p.id}
                          className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 text-sm"
                        >
                          <span className="text-gray-600">
                            {new Date(
                              p.paidAt
                            ).toLocaleDateString()}
                          </span>
                          <span className="text-green-600 font-semibold">
                            ₹ {p.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t text-right">
              <button
                onClick={() => setOpen(false)}
                className="bg-purple-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}