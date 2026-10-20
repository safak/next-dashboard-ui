"use client";

import * as React from "react";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";

import RadixSelect from "@/components/ui/RadixSelect";

interface Props {
  value?: Date | string;
  onChange?: (date?: Date) => void;
  icon?: React.ReactNode;
}

const months = [
  { value: "0", label: "Jan" },
  { value: "1", label: "Feb" },
  { value: "2", label: "Mar" },
  { value: "3", label: "Apr" },
  { value: "4", label: "May" },
  { value: "5", label: "Jun" },
  { value: "6", label: "Jul" },
  { value: "7", label: "Aug" },
  { value: "8", label: "Sep" },
  { value: "9", label: "Oct" },
  { value: "10", label: "Nov" },
  { value: "11", label: "Dec" },
];

export default function RadixDOBPicker({ value, onChange, icon }: Props) {
  const currentYear = new Date().getFullYear();

  const years = React.useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const y = currentYear - i;

        return {
          value: String(y),
          label: String(y),
        };
      }),
    [currentYear],
  );

  const [month, setMonth] = React.useState<string | undefined>();

  const [day, setDay] = React.useState<string | undefined>();

  const [year, setYear] = React.useState<string | undefined>();

  const normalizedValue = React.useMemo(() => {
    if (!value) return undefined;

    return value instanceof Date ? value : new Date(value);
  }, [value]);

  const valueTime = React.useMemo(
    () => normalizedValue?.getTime(),
    [normalizedValue],
  );

  React.useEffect(() => {
    if (!normalizedValue) {
      setMonth(undefined);
      setDay(undefined);
      setYear(undefined);
      return;
    }

    const d = dayjs(normalizedValue);

    setMonth(String(d.month()));
    setDay(String(d.date()));
    setYear(String(d.year()));
  }, [normalizedValue, valueTime]);

  const daysInMonth = React.useMemo(() => {
    if (!month) return 31;

    const safeYear = year ? Number(year) : 2000;

    return dayjs(new Date(safeYear, Number(month))).daysInMonth();
  }, [month, year]);

  const days = React.useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      })),
    [daysInMonth],
  );

  React.useEffect(() => {
    if (day && Number(day) > daysInMonth) {
      setDay(undefined);
    }
  }, [day, daysInMonth]);

  const lastEmittedRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!day || !month || !year) return;

    const nextTime = new Date(
      Number(year),
      Number(month),
      Number(day),
    ).getTime();

    if (lastEmittedRef.current === nextTime) {
      return;
    }

    lastEmittedRef.current = nextTime;

    onChange?.(new Date(nextTime));
  }, [day, month, year, onChange]);

  const calendarIcon = icon ?? <CalendarDays className="h-4 w-4" />;

  return (
    <div className="grid grid-cols-3 gap-3">
      <RadixSelect
        placeholder="Month"
        value={month}
        onChange={setMonth}
        options={months}
        icon={calendarIcon}
      />

      <RadixSelect
        placeholder="Day"
        value={day}
        onChange={setDay}
        options={days}
        disabled={!month}
        icon={calendarIcon}
      />

      <RadixSelect
        placeholder="Year"
        value={year}
        onChange={setYear}
        options={years}
        icon={calendarIcon}
      />
    </div>
  );
}
