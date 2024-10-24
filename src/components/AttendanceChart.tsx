"use client"
import Image from 'next/image';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Sun',
    present: 50,
    absent: 20,
  },
  {
    name: 'Mon',
    present: 50,
    absent: 20,
  },
  {
    name: 'Tue',
    present: 50,
    absent: 20,
  },
  {
    name: 'Wed',
    present: 50,
    absent: 20,
  },
  {
    name: 'Thus',
    present: 50,
    absent: 20,
  },
  {
    name: 'Fri',
    present: 50,
    absent: 20,
  },
  {
    name: 'Sat',
    present: 50,
    absent: 20,
  },
];
const AttendanceChart = () => {
  return (
    <div className='bg-white rounded-xl  h-full p-4'>
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Students</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} />
          <Tooltip />
          <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}/>
          <Bar dataKey="present" fill="#FAE27C" legendType='circle'radius={[10,10,0,0]}/>
          <Bar dataKey="absent" fill="#C3EBFA"  legendType='circle' radius={[10,10,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AttendanceChart