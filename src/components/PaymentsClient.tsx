"use client";

import { StudentFee } from "@prisma/client";
import Table from "@/components/Table";
import { PaymentStatusBadge } from "@/components/ui/FeeBadges";
import { FiEye, FiSend } from "react-icons/fi";
import PaymentCard from "@/components/mobile/PaymentCard";

/* ============================================================
   TYPES
============================================================ */

export interface FullStudentFee extends StudentFee {
  student: {
    name: string;
    surname: string;
    parent: { phone: string | null; email?: string | null } | null;
    class: { name: string } | null;
  };
  feeStructure: { title: string; amount: number };
  payments: { amount: number }[];
}

interface PaymentsClientProps {
  data: FullStudentFee[];
  count: number;
  page: number;
  role: string;
  classes: { id: number; name: string }[];
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function PaymentsClient({
  data,
  role,
}: PaymentsClientProps) {

  /* ============================================================
     TABLE COLUMNS
  ============================================================ */

  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Class", accessor: "class" },
    { header: "Fee", accessor: "fee", className: "tabular-nums w-[120px]", },

    {
      header: "Total",
      accessor: "total",
      className: "tabular-nums w-[120px]",
    },
    {
      header: "Paid",
      accessor: "paid",
      className: "tabular-nums w-[120px]",
    },
    {
      header: "Due",
      accessor: "due",
      className: "tabular-nums w-[120px]",
    },

    { header: "Status", accessor: "status", },

    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
            className: "w-[120px]",
          },
        ]
      : []),
  ];

  /* ============================================================
     ROW RENDER
  ============================================================ */

  const renderRow = (item: FullStudentFee, index: number) => {
    const total = item.feeStructure.amount;
    const paid = item.payments.reduce((sum, p) => sum + p.amount, 0);
    const due = total - paid;

    const studentName = `${item.student.name} ${item.student.surname}`;
    const dueStr = due.toLocaleString("en-IN");

    const phone = item.student.parent?.phone;
    const email = item.student.parent?.email;

    const encodedMsg = encodeURIComponent(
      `Dear Parent, your child ${studentName} has an outstanding fee of ₹${dueStr}. Please clear it at the earliest.`
    );

    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

    const sendEmail = async () => {
      if (!email) return;

      await fetch("/api/email/reminder", {
        method: "POST",
        body: JSON.stringify({
          parentEmail: email,
          studentName,
          dueAmount: dueStr,
        }),
      });

      alert("Email reminder sent!");
    };

    const status =
      paid === 0 ? "PENDING" : paid < total ? "PARTIAL" : "PAID";

    return (
      <tr
        key={item.id}
        className={`text-xs border-b border-gray-100 ${
          index % 2 === 0 ? "bg-slate-50" : "bg-white"
        } hover:bg-purple-50`}
      >
        {/* Student */}
        <td className="px-2 py-1.5 md:px-3 md:py-2 font-medium">{studentName}</td>

        {/* Class */}
        <td className="px-2 py-1.5 md:px-3 md:py-2">
          {item.student.class?.name ?? "-"}
        </td>

        {/* Fee Title */}
        <td className="px-2 py-1.5 md:px-3 md:py-2 truncate">{item.feeStructure.title}</td>

        {/* Total */}
        <td className="px-2 py-1.5 md:px-3 md:py-2 tabular-nums font-semibold">
          ₹{total.toLocaleString("en-IN")}
        </td>

        {/* Paid */}
        <td className="px-2 py-1.5 md:px-3 md:py-2 tabular-nums text-green-700 font-medium">
          ₹{paid.toLocaleString("en-IN")}
        </td>

        {/* Due */}
        <td className="px-2 py-1.5 md:px-3 md:py-2 tabular-nums text-red-600 font-semibold">
          ₹{dueStr}
        </td>

        {/* Status */}
        <td className="px-2 py-1.5 md:px-3 md:py-2">
          <PaymentStatusBadge status={status} />
        </td>

        {role === "admin" && (
          <td className="px-2 py-1.5 md:px-3 md:py-2 text-center">
            <div className="flex gap-3">

              {/* VIEW RECEIPT */}
              {due === 0 && (
                <div className="relative group">
                  <a
                    href={`/api/receipts/full/${item.studentId}`}
                    target="_blank"
                    className="w-6 h-6 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100"
                  >
                    <FiEye className="text-blue-600 w-4 h-4" />
                  </a>

                  <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded-md bg-blue-400 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
                    View Receipt
                  </span>
                </div>
              )}

              {/* WHATSAPP REMINDER */}
              {phone && due > 0 && (
                <div className="relative group">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="w-6 h-6 flex items-center justify-center bg-green-50 border border-green-300 rounded-full hover:bg-green-100"
                  >
                    <FiSend className="text-green-700 w-4 h-4" />
                  </a>

                  <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded-md bg-green-400 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
                    WhatsApp
                  </span>
                </div>
              )}

              {/* EMAIL REMINDER */}
              {email && due > 0 && (
                <div className="relative group">
                  <button
                    onClick={sendEmail}
                    className="w-6 h-6 flex items-center justify-center bg-yellow-50 border border-yellow-300 rounded-full hover:bg-yellow-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="orange"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded-md bg-yellow-400 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
                    Email
                  </span>
                </div>
              )}
            </div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block mt-4">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden mt-4 space-y-2">
        {data.map((item) => (
          <PaymentCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}