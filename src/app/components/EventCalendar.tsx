"use client"

import Image from 'next/image';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    "id": 1,
    "title": "Tech Conference 2024",
    "time": "2024-10-15T09:00:00",
    "description": "A gathering of tech enthusiasts to discuss the latest trends in technology."
  },
  {
    "id": 2,
    "title": "Product Launch",
    "time": "2024-10-20T13:00:00",
    "description": "Launch of the new innovative product line from the leading tech brand."
  },
  {
    "id": 3,
    "title": "Web Development Workshop",
    "time": "2024-11-05T15:00:00",
    "description": "An interactive workshop focusing on modern web development practices."
  }
]

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  
  return (
    <div className='bg-white p-4 rounded-md'>
      <Calendar onChange={onChange} value={value} />
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold my-4'>Finance</h1>
        <Image src={"/moreDark.png"} alt='' width={20} height={20}></Image>
      </div>
      <div className='flex flex-col gap-4'>
        {events.map(item => {
          return (
            <div className='p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even: border-t-lamaPurple' key={item.id}>
              <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-gray-600'>{item.title}</h1>
                <span className='text-gray-300 text-xs'>{item.time}</span>
              </div>
              <p className='mt-2 text-gray-400 text-sm'>{item.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EventCalendar