"use client";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia, laborum!",
    desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam perspiciatis illum distinctio exercitationem quaerat laboriosam ut impedit a corrupti eos? Doloribus necessitatibus provident aut sunt labore magnam delectus eius repudiandae!",
    time: "10:00 - 11:00",
  },
  {
    id: 2,
    title:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia, laborum!",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad sit totam voluptatum a ut modi amet qui, voluptate assumenda reiciendis quis reprehenderit officiis! Sequi reiciendis quibusdam nam hic provident consequuntur.",
    time: "10:00 - 11:00",
  },
  {
    id: 3,
    title:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia, laborum!",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quod.",
    time: "10:00 - 11:00",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white rounded-2xl p-4">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.map((events) => (
          <div
            className="p-5 rounded-md border-2 border-gray-200 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={events.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{events.title}</h1>
              <span className="text-gray-300 text-xs">{events.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{events.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
