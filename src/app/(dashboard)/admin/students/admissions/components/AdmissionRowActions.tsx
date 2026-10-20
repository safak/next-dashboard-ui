"use client";

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AdmissionStudent } from "@/services/admissions.service";

interface AdmissionRowActionsProps {
  admission: AdmissionStudent;

  onView: (admission: AdmissionStudent) => void;
  onEdit?: (admission: AdmissionStudent) => void;
  onDelete?: (admission: AdmissionStudent) => void;
}

export default function AdmissionRowActions({
  admission,
  onView,
  onEdit,
  onDelete,
}: AdmissionRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(admission)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(admission)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(admission)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}