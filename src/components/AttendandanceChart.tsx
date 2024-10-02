"use client"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import React from 'react'
import Image from 'next/image';

const AttendandanceChart = ({
  data,
}:{
  data:{name: string; present: number; absent: number}[]
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