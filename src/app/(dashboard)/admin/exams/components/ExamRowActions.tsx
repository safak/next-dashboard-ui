"use client";

import { Edit3, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExamRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExamRowActions({
  onEdit,
  onDelete,
}: ExamRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Exam actions"
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
          w-[150px]
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
          <p className="text-xs font-semibold text-slate-400">Exam Actions</p>

          <p className="mt-0.5 text-sm font-medium text-slate-700">
            Manage Exam
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={onEdit}
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

          <span>Edit Exam</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={onDelete}
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

          <span>Delete Exam</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
