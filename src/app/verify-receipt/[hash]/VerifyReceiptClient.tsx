"use client";

import { useEffect, useState } from "react";

export default function VerifyReceiptClient({ hash }: { hash: string }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/verify-receipt/${hash}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setError("Invalid or expired receipt.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setResult(data);
      } catch {
        setError("Failed to verify the receipt.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [hash]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Verifying your receipt…</div>
      </div>
    );
  }

  if (error || !result?.valid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center border border-red-200">
          <h1 className="text-xl font-bold text-red-600 mb-3">
            Invalid or Expired Receipt
          </h1>
          <p className="text-gray-600">
            The verification link is invalid or the receipt cannot be authenticated.
          </p>
        </div>
      </div>
    );
  }

  const data = result;

  return (
    <div className="flex justify-center px-4 py-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-2xl font-extrabold text-green-600 text-center mb-2">
          Receipt Verified
        </h1>

        <div className="space-y-3 text-sm mt-4">
          <div><b>Receipt No:</b> {data.receiptNo}</div>
          <div><b>Student:</b> {data.student.name} {data.student.surname}</div>
          <div><b>Total Paid:</b> ₹{data.totalPaid.toLocaleString("en-IN")}</div>
        </div>
      </div>
    </div>
  );
}
