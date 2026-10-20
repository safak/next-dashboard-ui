"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Printer,
} from "lucide-react";

interface Props {
  studentId: string;
}

export default function PrintButton({
  studentId,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => router.back()}
        className="rounded-lg border px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
      >
        <Printer className="h-4 w-4" />

        Print
      </button>

      <button
        onClick={() =>
          router.push(
            `/admin/students/admissions/${studentId}/pdf`,
          )
        }
        className="flex items-center gap-2 rounded-lg border px-5 py-2 hover:bg-slate-100"
      >
        <Download className="h-4 w-4" />

        Download PDF
      </button>
    </div>
  );
}