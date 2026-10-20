"use client";

import {
  ReceiptText,
  School,
  IndianRupee,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from "lucide-react";

import FeeStructureRowActions from "./FeeStructureRowActions";

export interface FeeStructureRow {
  id: number;
  classId: number;
  title: string;
  annualFee: number;
  admissionFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  class: {
    id: number;
    name: string;
  };
}

interface FeeStructuresTableProps {
  feeStructures: FeeStructureRow[];
  onEdit: (feeStructure: FeeStructureRow) => void;
  onDelete: (feeStructure: FeeStructureRow) => void;
  onView: (feeStructure: FeeStructureRow) => void;
}

export default function FeeStructuresTable({
  feeStructures,
  onEdit,
  onDelete,
  onView,
}: FeeStructuresTableProps) {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Class
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Fee Structure
                </span>
              </th>

              <th className="px-5 py-3 text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Annual Fee
                </span>
              </th>

              <th className="px-5 py-3 text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Admission Fee
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {feeStructures.map((item) => {
              return (
                <tr
                  key={item.id}
                  className="
                    group
                    border-b
                    border-slate-100
                    last:border-b-0
                    transition-colors
                    duration-150
                    hover:bg-indigo-50/30
                  "
                >
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-indigo-50
                          text-indigo-600
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        <School className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {item.class.name}
                        </p>

                        {/* <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                          <span>Class Fee</span>
                        </div> */}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-purple-100
                          text-purple-600
                        "
                      >
                        <ReceiptText className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium leading-5 text-slate-900">
                          {item.title}
                        </p>

                        {/* <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                          <span>ID #{item.id}</span>
                        </div> */}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-2.5 text-right">
                    <div className="inline-flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />

                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(item.annualFee)}
                        </span>
                      </div>

                      {/* <span className="mt-0.5 text-[10px] leading-3 text-slate-400">
                        Annual
                      </span> */}
                    </div>
                  </td>

                  <td className="px-5 py-2.5 text-right">
                    <div className="inline-flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-amber-500" />

                        <span className="text-sm font-semibold text-slate-800">
                          {formatCurrency(item.admissionFee)}
                        </span>
                      </div>

                      {/* <span className="mt-0.5 text-[10px] leading-3 text-slate-400">
                        Admission
                      </span> */}
                    </div>
                  </td>

                  <td className="px-5 py-2.5 text-center">
                    {item.isActive ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-emerald-50
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-emerald-700
                        "
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-slate-100
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-slate-500
                        "
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <FeeStructureRowActions
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {feeStructures.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No fee structures found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no fee structure records to display.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
