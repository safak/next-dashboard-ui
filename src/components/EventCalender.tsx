"use client";

import { useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getImagePath } from "@/lib/utils";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolo",
    time: "12:00 PM 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const EventCalender = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div>
      <div className="bg-white p-4 rounded-md">
        <Calendar onChange={onChange} value={value} />
        <div className="flex flex-row justify-between">
          <h1 className="capitalize font-semibold">Event</h1>
          <Image
            src={getImagePath("/moreDark.png")}
            alt="menu options"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </div>
        {events.map(item => (
          <div
            key={item.id}
            className={`shadow-md p-5 border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple  rounded-md mb-3 w-full`}
          >
            <div className="flex flex-row justify-between items-center">
              <h1>{item.title}</h1>
              <h6 className="text-xs text-gray-300 justify-end">{item.time}</h6>
            </div>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalender;
