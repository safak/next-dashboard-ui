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

import type { AnnouncementRow } from "../types";

interface AnnouncementRowActionsProps {
  announcement: AnnouncementRow;

  onEdit: (announcement: AnnouncementRow) => void;

  onDelete: (announcement: AnnouncementRow) => void;
}

export default function AnnouncementRowActions({
  announcement,
  onEdit,
  onDelete,
}: AnnouncementRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${announcement.title}`}
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
          w-[175px]
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1.5
          shadow-lg
          shadow-slate-200/60
        "
      >
        {/* Header */}

        <div className="px-2.5 py-2">
          <p className="text-xs font-semibold text-slate-400">
            Announcement Actions
          </p>

          <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
            {announcement.title}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Edit */}

        <DropdownMenuItem
          onClick={() => onEdit(announcement)}
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

          <span>Edit Announcement</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Delete */}

        <DropdownMenuItem
          onClick={() => onDelete(announcement)}
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

          <span>Delete Announcement</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
