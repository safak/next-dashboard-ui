"use client";

import {
  Archive,
  Edit3,
  Eye,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Student } from "@/types/student";

interface StudentRowActionsProps {
  student: Student;

  archived?: boolean;

  onView: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onArchive?: (student: Student) => void;
  onRestore?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export default function StudentRowActions({
  student,
  archived = false,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: StudentRowActionsProps) {
  return (
    <DropdownMenu>
      {/* ==================================================
          TRIGGER
      ================================================== */}

      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${student.fullName}`}
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

      {/* ==================================================
          ACTION MENU
      ================================================== */}

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
        {/* ==================================================
            MENU HEADER
        ================================================== */}

        <div className="px-2.5 py-2">
          <p className="text-xs font-semibold text-slate-400">
            Student Actions
          </p>

          <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
            {student.fullName}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* ==================================================
            VIEW PROFILE
        ================================================== */}

        <DropdownMenuItem
          onClick={() => onView(student)}
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

          <span>View Profile</span>
        </DropdownMenuItem>

        {/* ==================================================
            ACTIVE STUDENT ACTIONS
        ================================================== */}

        {!archived && (
          <>
            {/* Edit */}

            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(student)}
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

                <span>Edit Student</span>
              </DropdownMenuItem>
            )}

            {/* Archive */}

            {onArchive && (
              <>
                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                  onClick={() => onArchive(student)}
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
                    text-amber-600
                    outline-none
                    transition-colors
                    focus:bg-amber-50
                    focus:text-amber-700
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
                      bg-amber-50
                      text-amber-600
                      transition-colors
                      group-focus:bg-amber-100
                    "
                  >
                    <Archive className="h-3 w-3" />
                  </span>

                  <span>Archive Student</span>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}

        {/* ==================================================
            ARCHIVED STUDENT ACTIONS
        ================================================== */}

        {archived && (
          <>
            {/* Restore */}

            {onRestore && (
              <DropdownMenuItem
                onClick={() => onRestore(student)}
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
                  text-emerald-600
                  outline-none
                  transition-colors
                  focus:bg-emerald-50
                  focus:text-emerald-700
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
                    bg-emerald-50
                    text-emerald-600
                    transition-colors
                    group-focus:bg-emerald-100
                  "
                >
                  <RotateCcw className="h-3 w-3" />
                </span>

                <span>Restore Student</span>
              </DropdownMenuItem>
            )}

            {/* Permanent Delete */}

            {onDelete && (
              <>
                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                  onClick={() => onDelete(student)}
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

                  <span>Delete Permanently</span>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}