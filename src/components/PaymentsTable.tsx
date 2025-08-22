"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Clock } from "lucide-react";

export default function PaymentsTable({ data }: { data: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCheckboxChange = (checked: boolean, studentId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.set("studentId", studentId);
      router.push(`?${params.toString()}`);
    } else {
      params.delete("studentId");
      // Recharge complètement la page
      window.location.href = `${window.location.pathname}`;
    }
  };

  const selectedId = searchParams.get("studentId");

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-muted/10">
          <tr>
            <th className="p-3"><Checkbox /></th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Payment method</th>
            <th className="p-3">Description</th>
            <th className="p-3">Customer</th>
          </tr>
        </thead>
        <tbody>
          {data.map((payment) => {
            const paid = payment.amount;
            const due = payment.fee?.amount || 0;
            const isSolde = paid >= due;

            const isChecked = selectedId === payment.student.id;

            return (
              <tr key={payment.id} className="border-b hover:bg-muted/20">
                <td className="p-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked === true, payment.student.id)
                    }
                  />
                </td>
                <td className="p-3">{payment.amount}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      isSolde
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isSolde ? (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <Clock className="mr-1 h-4 w-4" />
                    )}
                    {isSolde ? "Payé" : "En attente"}
                  </span>
                </td>
                <td className="p-3">{payment.student.phone}</td>
                <td className="p-3">{payment.fee?.category}</td>
                <td className="p-3">{payment.student?.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
