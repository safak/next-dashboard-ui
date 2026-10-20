"use client";

import { Edit3, Eye, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FeeStructureRow } from "./FeeStructuresTable";

interface FeeStructureRowActionsProps {
  item: FeeStructureRow;
  onEdit: (feeStructure: FeeStructureRow) => void;
  onDelete: (feeStructure: FeeStructureRow) => void;
  onView?: (feeStructure: FeeStructureRow) => void;
}

export default function FeeStructureRowActions({
  item,
  onEdit,
  onDelete,
  onView,
}: FeeStructureRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${item.class.name} fee structure`}
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

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="
          w-[165px]
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1.5
          shadow-lg
          shadow-slate-200/60
        "
      >
        <div className="px-2.5 py-2">
          <p className="text-xs font-semibold text-slate-400">
            Fee Structure Actions
          </p>

          <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
            {item.class.name}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => onView?.(item)}
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
            text-slate-700
            outline-none
            transition-colors
            focus:bg-blue-50
            focus:text-blue-700
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
              bg-blue-50
              text-blue-600
              transition-colors
              group-focus:bg-blue-100
            "
          >
            <Eye className="h-3 w-3" />
          </span>

          <span>View Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit(item)}
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
            text-slate-700
            outline-none
            transition-colors
            focus:bg-violet-50
            focus:text-violet-700
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
              bg-violet-50
              text-violet-600
              transition-colors
              group-focus:bg-violet-100
            "
          >
            <Edit3 className="h-3 w-3" />
          </span>

          <span>Edit Fee Structure</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={() => onDelete(item)}
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

          <span>Delete Fee Structure</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
