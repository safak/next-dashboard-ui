"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";

export type ActionType =
  | "edit"
  | "assign"
  | "delete"
  | "whatsapp"
  | "view"
  | "email";

export default function ActionMenuClient({
  onAction,
  actions = ["view", "edit", "delete"],
}: {
  onAction: (action: ActionType) => void;
  actions?: ActionType[];
}) {
  const labelMap: Record<ActionType, string> = {
    view: "View",
    edit: "Edit",
    assign: "Assign",
    delete: "Delete",
    whatsapp: "Send",
    email: "Mail",
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="
            z-[100]
            rounded-lg border bg-white shadow-md
            px-3 py-2
          "
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            {actions.map((action, index) => (
              <div key={action} className="flex items-center gap-2">
                <DropdownMenu.Item
                  onSelect={() => onAction(action)}
                  className={`
                    cursor-pointer select-none
                    ${
                      action === "delete"
                        ? "text-red-600 hover:text-red-700"
                        : action === "assign"
                        ? "text-blue-600 hover:text-blue-700"
                        : action === "whatsapp"
                        ? "text-green-600 hover:text-green-700"
                        : "text-gray-700 hover:text-gray-900"
                    }
                  `}
                >
                  {labelMap[action]}
                </DropdownMenu.Item>

                {/* PIPE SEPARATOR */}
                {index < actions.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </div>
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}