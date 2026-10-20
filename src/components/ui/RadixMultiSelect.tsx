"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";

export type MultiOption = {
  value: string;
  label: string;
};

interface Props {
  value?: string[];
  onChange?: (v: string[]) => void;
  options: MultiOption[];
  placeholder?: string;
}

export default function RadixMultiSelect({
  value = [],
  onChange,
  options,
  placeholder = "Select",
}: Props) {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange?.(value.filter((v) => v !== val));
    } else {
      onChange?.([...value, val]);
    }
  };

  const label = value.length === 0 ? placeholder : `${value.length} selected`;

  return (
    <Popover.Root>
      {/* Trigger */}
      <Popover.Trigger asChild>
        <button
          type="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="
            w-full h-9 sm:h-10
            px-3
            flex items-center justify-between
            border rounded-lg
            bg-white
            text-xs sm:text-sm
            hover:bg-gray-50
          "
        >
          <span className="truncate text-left">{label}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </Popover.Trigger>

      {/* Dropdown */}
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          className="
            z-[9999]
            w-[var(--radix-popover-trigger-width)]
            max-h-60
            overflow-y-auto
            bg-white
            border
            rounded-lg
            shadow-xl
            p-1
          "
        >
          {options.map((opt) => {
            const checked = value.includes(opt.value);

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="
                  w-full
                  flex items-center justify-between
                  px-3 py-2
                  text-xs sm:text-sm
                  rounded-md
                  hover:bg-purple-50
                "
              >
                {opt.label}
                {checked && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
