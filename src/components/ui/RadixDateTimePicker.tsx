"use client";

import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
};

export default function RadixDateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
}: Props) {
  const [open, setOpen] = useState(false);

  const date = value;

  const hours = date?.getHours() ?? 0;
  const minutes = date?.getMinutes() ?? 0;

  const buildDate = (
    base: Date,
    hour: number,
    minute: number,
  ) => {
    return new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      hour,
      minute,
      0,
      0,
    );
  };

  const updateTime = (
    type: "hour" | "minute",
    value: number,
  ) => {
    const base = date ?? new Date();

    const next = buildDate(
      base,
      type === "hour" ? value : hours,
      type === "minute" ? value : minutes,
    );

    onChange(next);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-full h-10 flex items-center justify-between rounded-xl border bg-white px-3 text-sm hover:bg-gray-50"
        >
          <span className="truncate">
            {date ? (
              date.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>

          <CalendarIcon
            size={16}
            className="text-gray-500 shrink-0"
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[99999] rounded-xl border bg-white p-3 shadow-xl"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              if (!selected) return;

              onChange(
                buildDate(
                  selected,
                  hours,
                  minutes,
                ),
              );
            }}
          />

          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={23}
              value={hours}
              onChange={(e) =>
                updateTime(
                  "hour",
                  Number(e.target.value),
                )
              }
              className="h-9 w-16 rounded-md border px-2 text-sm"
            />

            <span>:</span>

            <input
              type="number"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) =>
                updateTime(
                  "minute",
                  Number(e.target.value),
                )
              }
              className="h-9 w-16 rounded-md border px-2 text-sm"
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}