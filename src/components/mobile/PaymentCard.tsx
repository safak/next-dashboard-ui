// components/mobile/PaymentCard.tsx
"use client";

import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";

export default function PaymentCard({ item }: { item: any }) {
  const total = item.feeStructure.amount;
  const paid = item.payments.reduce(
    (sum: number, p: any) => sum + p.amount,
    0
  );

  let status = "Pending";
  let statusClass = "text-red-600";

  if (paid === total) {
    status = "Paid";
    statusClass = "text-green-600";
  } else if (paid > 0) {
    status = "Partial";
    statusClass = "text-yellow-600";
  }

  /* ================= ACTION HANDLER ================= */
  const onAction = (action: ActionType) => {
    const studentName = `${item.student.name} ${item.student.surname}`;
    const message = `Payment details for ${studentName}:\nPaid: ₹${paid}\nTotal: ₹${total}`;

    if (action === "whatsapp") {
      const phone = item.student.parent?.phone;
      if (!phone) return;
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }

    if (action === "email") {
      const email = item.student.parent?.email;
      if (!email) return;
      window.location.href = `mailto:${email}?subject=Payment Details&body=${encodeURIComponent(
        message
      )}`;
    }
  };

  return (
    <div className="bg-white rounded-xl px-4 py-3 border shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {/* LEFT: ICON + STUDENT INFO */}
        <div className="flex items-start gap-3 min-w-0">
          {/* ICON */}
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-600 text-base font-semibold">₹</span>
          </div>

          {/* TEXT */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {item.student.name} {item.student.surname}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {item.student.class?.name || "—"}
            </p>
          </div>
        </div>

        {/* RIGHT: AMOUNT + STATUS + ACTIONS */}
        <div className="flex items-start gap-2 shrink-0">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              ₹{paid.toLocaleString()}
              <span className="text-xs text-gray-400">
                {" "}
                / ₹{total.toLocaleString()}
              </span>
            </p>

            <p className={`text-xs font-medium mt-0.5 ${statusClass}`}>
              {status}
            </p>
          </div>

          <ActionMenuClient
            onAction={onAction}
            actions={["whatsapp", "email"]}
          />
        </div>
      </div>
    </div>
  );
}