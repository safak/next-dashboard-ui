"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendarInner = () => {
  const [value, setValue] = useState<Value>(new Date());
  const router = useRouter();

  // Navigate only when the user picks a date. Doing this in an effect fired
  // on mount (React runs effects twice in dev), hijacking menu navigation.
  const handleChange = (newValue: Value) => {
    setValue(newValue);
    if (newValue instanceof Date) {
      router.push(`?date=${newValue.toISOString()}`, { scroll: false });
    }
  };

  return <Calendar locale="en-US" onChange={handleChange} value={value} />;
};

const EventCalendar = dynamic(() => Promise.resolve(EventCalendarInner), {
  ssr: false,
  loading: () => <div className="react-calendar min-h-[350px]" />,
});

export default EventCalendar;
