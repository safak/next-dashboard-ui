"use client";

import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export default function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const {
    pageIndex,
    pageSize,
  } = table.getState().pagination;

  const total = table.getFilteredRowModel().rows.length;

  const from =
    total === 0 ? 0 : pageIndex * pageSize + 1;

  const to = Math.min(
    (pageIndex + 1) * pageSize,
    total
  );

  return (
    <div className="flex flex-col gap-4 border-t bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}

      <div className="flex flex-wrap items-center gap-6">
        <p className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {from}-{to}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {total}
          </span>{" "}
          records
        </p>

        {/* Rows per page */}

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Rows
          </span>

          <select
            value={pageSize}
            onChange={(e) =>
              table.setPageSize(Number(e.target.value))
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-sky-500"
          >
            {[10, 20, 50, 100].map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium">
          Page{" "}
          <span className="font-semibold">
            {pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {table.getPageCount()}
          </span>
        </div>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() =>
            table.setPageIndex(table.getPageCount() - 1)
          }
          disabled={!table.getCanNextPage()}
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}