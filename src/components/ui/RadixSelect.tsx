"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Option = {
  value: string;
  label: string;
};

interface RadixSelectProps {
  value?: string;

  onChange?: (v: string) => void;

  placeholder?: string;

  options: readonly Option[];

  disabled?: boolean;

  emptyTitle?: string;

  emptyDescription?: string;

  className?: string;

  icon?: ReactNode;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;
}

export default function RadixSelect({
  value,
  onChange,
  placeholder = "Select",
  options,
  disabled = false,
  emptyTitle = "No data available",
  emptyDescription = "Please create records first.",
  className,
  icon,
  open,
  onOpenChange,
}: RadixSelectProps) {
  const hasOptions = options.length > 0;

  return (
    <Select.Root
      value={value ?? ""}
      open={open}
      onOpenChange={onOpenChange}
      onValueChange={(v) => {
        if (v === "") {
          return;
        }
        onChange?.(v);
        onOpenChange?.(false);
      }}
    >
      <Select.Trigger
        type="button"
        disabled={disabled}
        className={cn(
          `
            flex
            h-11
            w-full
            items-center
            justify-between
            rounded-lg
            border
            border-slate-300
            bg-white
            px-3
            text-sm
            text-slate-700
            shadow-sm
            outline-none
            transition

            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100

            disabled:cursor-not-allowed
            disabled:bg-slate-50
            disabled:text-slate-400
          `,
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="flex shrink-0 items-center text-slate-500">
              {icon}
            </span>
          )}

          <Select.Value
            placeholder={<span className="text-slate-400">{placeholder}</span>}
          />
        </span>

        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          align="start"
          sideOffset={6}
          collisionPadding={12}
          avoidCollisions
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          className="
            z-[9999]
            w-[--radix-select-trigger-width]
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >
          <Select.ScrollUpButton className="flex h-8 items-center justify-center bg-white">
            <ChevronUp className="h-4 w-4 text-slate-400" />
          </Select.ScrollUpButton>

          <Select.Viewport className="max-h-64 p-1">
            {!hasOptions ? (
              <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
                <Inbox className="mb-3 h-8 w-8 text-slate-300" />

                <p className="font-medium text-slate-700">{emptyTitle}</p>

                <p className="mt-1 text-xs text-slate-500">
                  {emptyDescription}
                </p>
              </div>
            ) : (
              options
                .filter((opt) => opt.value.trim() !== "")
                .map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className="
                      relative
                      flex
                      h-10
                      cursor-pointer
                      select-none
                      items-center
                      rounded-md
                      px-3
                      text-sm
                      text-slate-700
                      outline-none

                      hover:bg-blue-50
                      focus:bg-blue-50

                      data-[state=checked]:bg-blue-50
                      data-[state=checked]:text-blue-700
                    "
                  >
                    <Select.ItemText>{opt.label}</Select.ItemText>

                    <Select.ItemIndicator className="absolute right-3">
                      <Check className="h-4 w-4 text-blue-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))
            )}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex h-8 items-center justify-center bg-white">
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
