"use client";

import { useState } from "react";

import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTableToolbar from "./DataTableToolbar";
import DataTablePagination from "./DataTablePagination";
import DataTableEmpty from "./DataTableEmpty";
import DataTableLoading from "./DataTableLoading";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  loading?: boolean;

  title?: string;
  description?: string;

  searchable?: boolean;
  searchPlaceholder?: string;

  pageSize?: number;

  toolbar?: React.ReactNode;
}

export default function DataTable<TData, TValue>({
  columns,
  data,

  loading = false,

  title,
  description,

  searchable = true,
  searchPlaceholder = "Search...",

  pageSize = 10,

  toolbar,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // ✅ Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      globalFilter,
      pagination,
    },

    onSortingChange: setSorting,

    onGlobalFilterChange: setGlobalFilter,

    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {(title || description) && (
        <div className="border-b px-6 py-5">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}

      {searchable && (
        <DataTableToolbar
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          filters={toolbar}
        />
      )}

      {loading ? (
        <DataTableLoading rows={pagination.pageSize} columns={columns.length} />
      ) : table.getFilteredRowModel().rows.length === 0 ? (
        <DataTableEmpty />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-6 py-4 text-left text-sm font-semibold
    ${
      header.column.getCanSort()
        ? "cursor-pointer select-none hover:bg-slate-100"
        : ""
    }`}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted() as string] ?? ""}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
