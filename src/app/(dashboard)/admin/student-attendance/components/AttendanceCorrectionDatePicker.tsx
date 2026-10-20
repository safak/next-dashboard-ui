"use client";

import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";

import { formatDateToISO, parseDate } from "./utils";

interface AttendanceCorrectionDatePickerProps {
  value: string;
  selectedMonth: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export default function AttendanceCorrectionDatePicker({
  value,
  selectedMonth,
  onChange,
  disabled = false,
}: AttendanceCorrectionDatePickerProps) {
  const selectedDate = parseDate(value);

  const [year, month] = selectedMonth.split("-").map(Number);

  const monthStart = new Date(year, month - 1, 1);

  const today = new Date();

  /**
   * For the current month:
   * allow only dates up to today.
   *
   * For previous months:
   * allow the complete selected month.
   */
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month - 1;

  const monthEnd = new Date(year, month, 0);

  const maxDate = isCurrentMonth ? today : monthEnd;

  return (
    <div className="w-full sm:w-[190px]">
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
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (!date) {
              return;
            }

            onChange(formatDateToISO(date));
          }}
          dateFormat="MMM d, yyyy"
          placeholderText="Select date"
          disabled={disabled}
          minDate={monthStart}
          maxDate={maxDate}
          wrapperClassName="w-full"
          className="
            h-10
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
        />
      </div>
    </div>
  );
}
