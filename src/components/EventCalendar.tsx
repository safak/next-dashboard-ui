"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendarInner = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (value instanceof Date) {
      router.push(`?date=${value.toISOString()}`);
    }
  }, [value, router]);

  return <Calendar locale="en-US" onChange={onChange} value={value} />;
};

const EventCalendar = dynamic(() => Promise.resolve(EventCalendarInner), {
  ssr: false,
  loading: () => <div className="react-calendar min-h-[350px]" />,
});

export default EventCalendar;
