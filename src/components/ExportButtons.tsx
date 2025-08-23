'use client';

import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

type Props = {
  data: any[];
  columns: { header: string; accessor: string }[];
  meta?: {
    className: string;
    subjectName: string;
    periodLabel: string;
  };
};

export default function ExportButtons({ data, columns, meta }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToPDF(data, columns, meta)}
        className="px-2 py-1 rounded bg-blue-500 text-white text-xs"
      >
        Export PDF
      </button>
      <button
        onClick={() => exportToExcel(data, columns, meta)}
        className="px-2 py-1 rounded bg-green-600 text-white text-xs"
      >
        Export Excel
      </button>
    </div>
  );
}
