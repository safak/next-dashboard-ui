"use client";

export default function ReceiptButton({
  studentFeeId,
}: {
  studentFeeId: number;
}) {
  return (
    <a
      href={`/api/receipts/${studentFeeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      Print Receipt
    </a>
  );
}
