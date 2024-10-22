"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { TvChannel } from "@/schemas/tables.schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { TvRowActions } from "./tv-row-actions";

export const columns: ColumnDef<TvChannel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="hidden">
        <DataTableColumnHeader column={column} title="ID" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden">
          <span className="capitalize"> {row.getValue("id")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "tvIcon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Icon" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize justify-center">
        {!row.getValue("tvIcon") ? (
          <Image
            src='/images/no-image.png'
            width={50}
            height={50}
            alt='no image'
            className='aspect-square h-[80px] w-[150px] rounded-lg'
          />) : (
          <Image
            src={row.getValue("tvIcon")}
            width={50}
            height={50}
            alt="image"
            className='aspect-square h-[80px] w-[150px] rounded-lg'
          />
        )}
      </div>
    ),
  },
  {
    accessorKey: "tvName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 justify-center">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("tvName")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "tvNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TV Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center justify-center">
          <span className="capitalize"> {row.getValue("tvNumber")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "tvmedia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TV Media" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="max-w-[500px] truncate capitalize font-medium"> {row.getValue("tvmedia")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "isStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("isStatus");

      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              " dark:bg-zinc-800 px-2 py-1 rounded-full  capitalize text-sm border-zinc-300  border",
              {
                "text-greenlight px-4 dark:border-green-400 bg-green-200":
                  status === true,
                "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
                  status === false,
              }
            )}
          >
            {!status ?
              "Disable" : "Enable"}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Update Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    }
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) =>
      <div className="flex w-[100px] items-center">
        <TvRowActions row={row} title="TV Channel" description={`Action ${row.getValue("tvName")} channel`} />
      </div>
  }
];