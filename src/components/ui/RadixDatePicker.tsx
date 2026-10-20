"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface Props {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
}

export default function RadixDatePicker({
  value,
  onChange,
  placeholder = "Select date",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const today = new Date();
  const fromDate = new Date(today.getFullYear() - 80, 0, 1); // DOB range
  const toDate = today; // ❌ no future DOBs

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
      {/* ===== Trigger ===== */}
      <Popover.Trigger asChild>
        <button
          type="button"
          className="
            w-full h-9 sm:h-12 px-3
            flex items-center justify-between
            rounded-xl border bg-white
            text-xs sm:text-sm
            focus:border-blue-600 focus:ring-2 focus:ring-blue-100
          "
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 opacity-60" />
            {value ? (
              <span>{dayjs(value).format("DD MMM YYYY")}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
        </button>
      </Popover.Trigger>

      {/* ===== Calendar ===== */}
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="
    z-[99999]
    rounded-2xl
    border
    bg-white
    shadow-xl
    p-2
    overflow-visible
  "
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            fromDate={fromDate}
            toDate={toDate}
            captionLayout="dropdown"
            className="rounded-md"
          />

          {/* Footer */}
          <div className="flex justify-between px-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onChange?.(today);
                setOpen(false);
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                onChange?.(undefined);
                setOpen(false);
              }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
