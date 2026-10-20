"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  selectedMonth: string;
  months: string[];
  studentId: string;
  year: number;
};

export default function MobileMonthDropdown({
  selectedMonth,
  months,
  studentId,
  year,
}: Props) {
  const [open, setOpen] = useState(false);

  const getMonthNumber = (month: string) => {
    const index = months.findIndex((item) => item === month);

    return index + 1;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="
          flex
          h-11
          items-center
          gap-2
          rounded-[18px]
          border
          border-slate-100
          bg-white
          px-4
          shadow-[0_8px_24px_rgba(15,23,42,0.06)]
          transition
          active:scale-[0.98]
        "
      >
        <CalendarDays size={16} className="text-[#4B517D]" />

        <span className="text-[13px] font-bold text-slate-800">
          {selectedMonth}
        </span>

        <ChevronDown
          size={16}
          className={`
            text-slate-400
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close month selector"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] cursor-default"
          />

          <div
            className="
              absolute
              right-0
              top-14
              z-[100]
              w-[150px]
              rounded-[26px]
              border
              border-slate-100
              bg-white
              p-2
              shadow-[0_20px_50px_rgba(15,23,42,0.12)]
            "
          >
            {months.map((month, index) => {
              const monthNumber = index + 1;

              const isSelected = selectedMonth === month;

              const href = `/parent/attendance?studentId=${encodeURIComponent(
                studentId,
              )}&month=${monthNumber}&year=${year}`;

              return (
                <Link
                  key={month}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    px-4
                    py-3
                    transition-all
                    ${
                      isSelected
                        ? "bg-[#4B517D] text-white"
                        : "text-slate-700 hover:bg-[#F8F8FC]"
                    }
                  `}
                >
                  <span className="text-[14px] font-semibold">{month}</span>

                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
