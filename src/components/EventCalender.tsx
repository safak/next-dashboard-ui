"use client";

import React from "react";
import Calendar from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
const events = [
  {
    id: 1,
    name: "Meeting with Parents",
    date: new Date(2023, 4, 15),
    eventDescription: "Discussing the progress of students with their parents.",
  },
  {
    id: 2,
    name: "Science Fair",
    date: new Date(2023, 4, 20),
    eventDescription: "Annual science fair showcasing projects from students.",
  },
  {
    id: 3,
    name: "Sports Day",
    date: new Date(2023, 4, 25),
    eventDescription: "A day full of sports activities and competitions.",
  },
  {
    id: 4,
    name: "Teacher Training",
    date: new Date(2023, 4, 30),
    eventDescription: "Professional development training for teachers.",
  },
];

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalender = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className=" w-full  bg-white rounded-lg shadow-md p-4">
      <Calendar onChange={onChange} value={value} />
      <div className=" flex items-center justify-between">
        <h1 className=" text-xl font-semibold my-4">Upcoming Events</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-5">
        {events.map((e) => (
          <div className="border-b-4  border-gray-400 pb-4" key={e.id}>
            <div className="flex items-center justify-between">
              <h1 className=" text-lg font-semibold">{e.name}</h1>
              <span className=" text-sm text-gray-500 bg-white px-2 py-1 rounded-md">
                {e.date.toLocaleDateString()}
              </span>
            </div>
            <p className=" text-sm text-gray-500 mt-2">{e.eventDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalender;
