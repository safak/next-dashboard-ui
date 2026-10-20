"use client";

import { ReactNode } from "react";
import NoData from "./NoData";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];

  loading?: boolean;

  striped?: boolean;
  hover?: boolean;

  rowKey: (row: T) => string | number;

  // NEW
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  striped = true,
  hover = true,
  rowKey,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-12 rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <NoData message="No records found." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.title}
                  style={{ width: column.width }}
                  className={`border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-slate-100
                  ${
                    striped && rowIndex % 2 === 1
                      ? "bg-slate-50/40"
                      : "bg-white"
                  }
                  ${
                    hover
                      ? "transition-colors hover:bg-violet-50"
                      : ""
                  }
                  ${
                    onRowClick
                      ? "cursor-pointer"
                      : ""
                  }
                  ${rowClassName?.(row) ?? ""}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.title}
                    className={`px-4 py-3 text-sm text-slate-700 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}