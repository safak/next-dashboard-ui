"use client"
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';


import React from 'react'
import Image from 'next/image';

const CountChart = ({boys, girls}:{boys: number; girls: number}) => {
  const data = [
    {
        name: 'Total',
        count: boys+girls,
        fill: 'white',
      },
  {
    name: 'Girls',
    count: girls,
    fill: '#f4a261',
  },
  {
    name: 'Boys',
    count: boys,
    fill: '#3a5a40',
  },
 
];
  return (
    <div className="relative w-full h-[75%]">

        <ResponsiveContainer >
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar
        //   label={{ position: 'insideStart', fill: '#fff' }}
            background
            
            dataKey="count"
          />
          {/* <Legend iconSize={10} layout="vertical" verticalAlign="middle" /> */}
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src="/maleFemale.png" alt='maleFemale' width={50} height={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
      </div>
       
  )
}

export default CountChart