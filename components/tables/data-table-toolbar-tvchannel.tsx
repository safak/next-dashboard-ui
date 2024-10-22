"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDatePicker } from "@/components/calendar/calendar-date-picker";
import { useState } from "react";
import { DataTableViewOptions } from "@/components/tables/data-table-view-options";
import { AddChannel } from "../tvchannel";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableTVChannelToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date()
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn("updatedAt")?.setFilterValue([from, to]);
  };


  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-2 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter Name..."
          value={(table.getColumn("tvName")?.getFilterValue() as string)
          }
          onChange={(event) => {
            {table.getColumn("tvName")?.setFilterValue(event.target.value)
            }
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="w-[250px] h-8"
          variant="outline"
        />
      </div>
      <div className="flex flex-2 flex-wrap items-center gap-2 pt-2">
        <DataTableViewOptions table={table} />
        <AddChannel/>
      </div>
    </div>
  );
}
