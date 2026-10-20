"use client";

import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";

import { formatMonthToISO, parseMonth } from "./utils";

interface AttendanceMonthPickerProps {
  value: string;

  onChange: (month: string) => void;

  disabled?: boolean;

  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export default function AttendanceMonthPicker({
  value,
  onChange,
  disabled = false,
  open,
  onOpenChange,
}: AttendanceMonthPickerProps) {
  return (
    <div className="w-full sm:w-[235px]">
      <div className="relative">
        <CalendarDays
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            z-10
            h-4
            w-4
            -translate-y-1/2
            text-indigo-500
          "
        />

        <DatePicker
          id="attendance-month"
          selected={parseMonth(value)}
          onChange={(date: Date | null) => {
            if (!date) {
              return;
            }

            onChange(formatMonthToISO(date));

            /**
             * Close immediately after
             * selecting a month.
             */
            onOpenChange(false);
          }}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          placeholderText="Select month"
          disabled={disabled}
          open={open}
          onCalendarOpen={() => {
            onOpenChange(true);
          }}
          onCalendarClose={() => {
            onOpenChange(false);
          }}
          wrapperClassName="w-full"
          className="
            h-11
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            pl-10
            pr-3
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition

            hover:border-slate-300

            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
          popperPlacement="bottom-end"
          showPopperArrow={false}
          popperClassName="student-attendance-month-picker"
          maxDate={new Date()}
        />
      </div>
    </div>
  );
}
