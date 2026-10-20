"use client";

import { ReactNode } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";

import { Button } from "../button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;

  children?: ReactNode;
}

function ActionButton({
  icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
      ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function RowActions({
  onView,
  onEdit,
  onDelete,
  onPrint,
  children,
}: RowActionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-48 p-2"
      >
        <div className="space-y-1">
          {onView && (
            <ActionButton
              label="View"
              icon={<Eye className="h-4 w-4" />}
              onClick={onView}
            />
          )}

          {onEdit && (
            <ActionButton
              label="Edit"
              icon={<Pencil className="h-4 w-4" />}
              onClick={onEdit}
            />
          )}

          {onPrint && (
            <ActionButton
              label="Print"
              icon={<Printer className="h-4 w-4" />}
              onClick={onPrint}
            />
          )}

          {children}

          {onDelete && (
            <>
              <div className="my-1 border-t" />

              <ActionButton
                destructive
                label="Delete"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={onDelete}
              />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}