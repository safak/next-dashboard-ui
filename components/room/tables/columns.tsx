"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Patient } from "@/schemas/tables.schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { RoomRowActions } from "./room-row-actions";

export const columns: ColumnDef<Patient>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 justify-center">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "roomNumber",
    header: ({ column }) => (
      <div className="hidden">
        <DataTableColumnHeader column={column} title="roomNumber" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("roomNumber")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "admisDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Admis Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("admisDate"));
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
    accessorKey: "roomType",
    header: ({ column }) => (
      <div className="hidden">
        <DataTableColumnHeader column={column} title="roomType" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("roomType")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "exceptedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Excepted Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("exceptedDate"));
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
    accessorKey: "reason",
    header: ({ column }) => (
      <div className="hidden">
        <DataTableColumnHeader column={column} title="reason" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("reason")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "roomNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="max-w-[500px] truncate capitalize font-medium"> {row.getValue("roomNumber")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "ward",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ward" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="max-w-[500px] truncate capitalize font-medium"> {row.getValue("ward")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "nextOfKin",
    header: ({ column }) => (
      <div className="hidden">
        <DataTableColumnHeader column={column} title="nextOfKin" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("nextOfKin")}
          </span>
        </div>
      );
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
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) =>
      <div className="flex w-[100px] items-center">
        <RoomRowActions row={row} title="Action Room" description={`Action ${row.getValue("name")}`} />
      </div>
  }
];