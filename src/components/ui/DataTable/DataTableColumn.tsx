"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "../button";

interface DataTableColumnProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export default function DataTableColumn<TData, TValue>({
  column,
  title,
}: DataTableColumnProps<TData, TValue>) {
  const sorted = column.getIsSorted();

  const Icon =
    sorted === "asc"
      ? ArrowUp
      : sorted === "desc"
      ? ArrowDown
      : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      onClick={() =>
        column.toggleSorting(sorted === "asc")
      }
      className="h-auto p-0 font-semibold uppercase tracking-wide text-slate-600 hover:bg-transparent"
    >
      <span>{title}</span>

      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}