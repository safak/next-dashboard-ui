"use client"

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
//temporary
const events = [
    {
        id:1,
        title: "event 1",
        time: "12:00 PM - 3:00 PM",
        discription:"LOREM IPSUM DOLOR SITAMET"
    },
    {
        id:2,
        title: "event 2",
        time: "12:00 PM - 3:00 PM",
        discription:"LOREM IPSUM DOLOR SITAMET"
    },{
        id:3,
        title: "event 3",
        time: "12:00 PM - 3:00 PM",
        discription:"LOREM IPSUM DOLOR SITAMET"
    }
];

const Eventcalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

  return (
    <div className='bg-white p-4 rounded-md shadow-md '>
              <Calendar onChange={onChange} value={value} />
              <div className="flex items-center justify-between  ">
                <h1 className="text-xl font-semibold my-4 ">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20}/>
              </div>
              <div className="flex flex-col gap-4">
                {events.map(event=>(
                    <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-[#90caf9] even:border-t-[#8884d8]" key={event.id}>
                        <div className="flex items-center justify-between ">
                            <h1 className="font-semibold text-gray-600">{event.title}</h1>
                            <span className="text-xs text-gray-400">{event.time}</span>
                        </div>
                        <p className="mt-2 text-gray-500 text-sm">{event.discription}</p>
                    </div>
                ))}
              </div>

    </div>
  )
}

export default Eventcalendar