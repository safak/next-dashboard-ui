"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Calendar from "react-calendar";

type Props = {
  selectedDate: Date;
  holidays: Map<string, { title: string; isFullDay: boolean }>;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const toLocalDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

export default function EventCalendar({ selectedDate, holidays }: Props) {
  const router = useRouter();

  const [value, setValue] = useState<Date>(selectedDate);

  /* Day click */
  const handleChange = (val: Value) => {
    const date = Array.isArray(val) ? val[0] : val;
    if (!date) return;

    setValue(date);
    router.push(`?date=${toLocalDateKey(date)}`);
  };

  /* Month / year navigation */
  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (!activeStartDate) return;

    router.push(`?date=${toLocalDateKey(activeStartDate)}`);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const holiday = holidays.get(toLocalDateKey(date));
    if (!holiday) return null;

    return (
      <div className="holiday-marker">
        <span className="holiday-dot" />
        <div className="holiday-tooltip">
          {holiday.title}
          {holiday.isFullDay && " (Full Day)"}
        </div>
      </div>
    );
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) =>
    view === "month" && holidays.has(toLocalDateKey(date))
      ? "holiday-tile"
      : undefined;

  return (
    <Calendar
      locale="en-GB"
      value={value}
      onChange={handleChange}
      onActiveStartDateChange={handleActiveStartDateChange}
      tileContent={tileContent}
      tileClassName={tileClassName}
      showNeighboringMonth={false}
    />
  );
}
