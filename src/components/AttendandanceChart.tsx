"use client"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    present: 54,
    absent: 23,
    
  },
  {
    name: 'Tue',
    present: 32,
    absent: 78,

  },
  {
    name: 'Web',
    present: 133,
    absent: 4,
   
  },
  {
    name: 'Thu',
    present: 56,
    absent: 23,
   
  },
  {
    name: 'Fri',
    present: 32,
    absent: 23,
    
  },
  {
    name: 'Sat',
    present: 45,
    absent: 25,
    
  },
  {
    name: 'Sun',
    present: 45,
    absent: 25,
    
  },
];
import React from 'react'
import Image from 'next/image';

const AttendandanceChart = ({
  data1,
}:{
  data1:{name: string; present: number; absent: number}[]
}) => {
  return (
   
<ResponsiveContainer width="90%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
         
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false}  stroke='#ddd'/>
          <XAxis dataKey="name" axisLine={false} tick={{fill: "#d1d5db"}} tickLine={false}/>
          <YAxis axisLine={false} tick={{fill: "#d1d5db"}} tickLine={false}/>
          <Tooltip contentStyle={{borderRadius: "10px", borderColor: 'lightgray'}} />
          <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop:"20px", paddingBottom: "40px"}}/>
          <Bar 
          dataKey="present" 
          fill="#3a5a40"
          legendType='circle'
          radius={[10,10,0,0]}
          />
          <Bar 
          dataKey="absent" 
          fill="#f4a261" 
          legendType='circle'
          radius={[10,10,0,0]}
          />
        </BarChart>
      </ResponsiveContainer>
    
  )
}

export default AttendandanceChart