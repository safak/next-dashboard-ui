

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { UserRegistrationProps } from "@/schemas/auth.schemas";
import { UserRole } from "@prisma/client";
import { UserAvatar } from "@/components/avatar";
import { DataRowActions } from "./re-row-actions";
import { Badge } from "@/components/ui/badge";


export const columns: ColumnDef<UserRegistrationProps>[] = [
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
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),

    cell: ({ row }) => (
      <div className="w-[50px] capitalize justify-center">
        <UserAvatar src={row.getValue("image") || '/images/no-avatar.png'} className="h-14 w-14 text-center" fallback={["No Image"]} />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[150px] items-center">
          <span className="text-sm"> {row.getValue("email")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role");
      return (
        <div className="flex items-center">
          <Badge
            variant={role === UserRole.ADMIN ? "success" : "secondary"}
          >
            {role === UserRole.ADMIN ? "Admin" : "User"}
          </Badge>
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
        <div className="flex items-center">
            <Badge
            variant={status ? "success" : "destructive"}
          >
            {status ? "Enable" : "Disable"}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "isTwoFactorEnabled",
    header: ({ column }) => (
      <div className="hidden">
        <DataTableColumnHeader column={column} title="Email" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden">
          <span className="capitalize"> {row.getValue("isTwoFactorEnabled")}</span>
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
        <DataRowActions row={row} title="User Register" description={`Action ${row.getValue("name")} user`} />
      </div>
  }
];