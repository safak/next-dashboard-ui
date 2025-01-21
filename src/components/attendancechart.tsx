"use client"
import Image from 'next/image';
{/*import React, { PureComponent } from 'react';*/}
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'MON',
    present: 40,
    absent: 24,
  },
  {
    name: 'TUE',
    present: 30,
    absent: 18,
  },
  {
    name: 'WED',
    present: 20,
    absent: 90,
  },
  {
    name: 'THU',
    present: 22,
    absent: 39,
  },
  {
    name: 'FRI',
    present: 10,
    absent: 40,
  },
];
const Attendancechart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
        <div className='flex justify-between items-center'>
            <h1 className='text-xl font-semibold '>Attendance</h1>
            <Image src="/moreDark.png" alt='' width={20} height={20}/>
        </div>
        <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20} >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#9e9e9e"}} tickLine={false}/>
          <YAxis axisLine={false}  tick={{fill:"#9e9e9e"}} tickLine={false}/>
          <Tooltip />
          <Legend align="left" verticalAlign='top' wrapperStyle={{paddingTop:"20px",paddingBottom:"40px"}} />
          <Bar dataKey="present" fill="#8884d8" activeBar={<Rectangle fill="red" stroke="blue" />} />
          <Bar dataKey="absent" fill="#90caf9" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Attendancechart