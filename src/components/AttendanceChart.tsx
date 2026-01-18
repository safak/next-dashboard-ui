"use client";

import Image from 'next/image';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    present: 60,
    absent: 24,
  },
  {
    name: 'Tue',
    present: 30,
    absent: 13,
  },
  {
    name: 'Wed',
    present: 20,
    absent: 58,
  },
  {
    name: 'Thu',
    present: 27,
    absent: 39,

  },
  {
    name: 'Fri',
    present: 18,
    absent: 48,
  },
];


const AttendanceChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Attendance</h1>
            <Image src="/moreDark.png" alt='' width={20} height={20}/>
        </div>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#302780" legendType='circle' radius={[8,8,0,0]}/>
          <Bar dataKey="absent" fill="#FAE27C" legendType='circle' radius={[8,8,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
       
           
            
    </div>

  )
}

export default AttendanceChart