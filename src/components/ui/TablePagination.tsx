"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  const from =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const to =
    total === 0
      ? 0
      : Math.min(page * pageSize, total);

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div
      className="
        flex
        min-h-[58px]
        flex-col
        gap-3
        rounded-b-xl
        border
        border-t-0
        border-slate-200
        bg-white
        px-4
        py-2.5
        sm:px-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* ==================================================
          LEFT
      ================================================== */}

      <div className="flex flex-wrap items-center gap-4">
        {/* Record Count */}

        <p className="whitespace-nowrap text-xs text-slate-500 sm:text-sm">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {from}-{to}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {total}
          </span>{" "}
          {total === 1 ? "record" : "records"}
        </p>

        {/* Rows Per Page */}

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs text-slate-500 sm:text-sm">
            Rows per page
          </span>

          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);

              onPageSizeChange(newSize);
              onPageChange(1);
            }}
            aria-label="Rows per page"
            className="
              h-8
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              px-2.5
              text-xs
              font-medium
              text-slate-700
              outline-none
              transition
              hover:border-indigo-200
              hover:bg-indigo-50/40
              focus:border-indigo-400
              focus:bg-white
              focus:ring-2
              focus:ring-indigo-100
              sm:text-sm
            "
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

      {/* ==================================================
          RIGHT
      ================================================== */}

      <div className="flex items-center justify-between gap-1.5 sm:justify-end sm:gap-2">
        {/* First */}

        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="First page"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-100
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-500
          "
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous */}

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-100
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-500
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Indicator */}

        <div
          className="
            flex
            h-8
            items-center
            rounded-lg
            border
            border-indigo-100
            bg-indigo-50
            px-3
            text-xs
            font-medium
            text-indigo-700
            sm:text-sm
          "
        >
          Page{" "}
          <span className="mx-1 font-bold">
            {page}
          </span>{" "}
          of{" "}
          <span className="ml-1 font-bold">
            {totalPages}
          </span>
        </div>

        {/* Next */}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-100
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-500
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last */}

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Last page"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-100
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-500
          "
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}