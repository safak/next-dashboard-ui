"use client";

import { MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { PaymentWithRelations } from "../types";

interface PaymentRowActionsProps {
  payment: PaymentWithRelations;
  onDelete?: (payment: PaymentWithRelations) => void;
}

export default function PaymentRowActions({
  payment,
  onDelete,
}: PaymentRowActionsProps) {
  const studentName =
    `${payment.studentFee.student.name} ${payment.studentFee.student.surname}`.trim();

  return (
    <DropdownMenu>
      {/* Trigger */}

      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${studentName}`}
          className="
            h-9
            w-9
            rounded-lg
            text-slate-500
            transition-all
            duration-150
            hover:bg-slate-100
            hover:text-slate-700
            data-[state=open]:bg-slate-100
            data-[state=open]:text-slate-700
          "
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      {/* Action Menu */}

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="
          w-[170px]
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1.5
          shadow-lg
          shadow-slate-200/60
        "
      >
        {/* Menu Header */}

        <div className="px-2.5 py-2">
          <p className="text-xs font-semibold text-slate-400">
            Payment Actions
          </p>

          <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
            {studentName}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Delete */}

        <DropdownMenuItem
          onClick={() => onDelete?.(payment)}
          className="
            group
            flex
            h-8
            cursor-pointer
            items-center
            gap-3
            rounded-lg
            px-2.5
            text-xs
            font-medium
            text-red-600
            outline-none
            transition-colors
            focus:bg-red-50
            focus:text-red-700
          "
        >
          <span
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-red-50
              text-red-600
              transition-colors
              group-focus:bg-red-100
            "
          >
            <Trash2 className="h-3 w-3" />
          </span>

          <span>Delete Payment</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
