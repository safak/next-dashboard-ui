"use client";

import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    present: 85,
    absent: 45,
  },
  {
    name: 'Tue',
    present: 72,
    absent: 38,
  },
  {
    name: 'Wed',
    present: 65,
    absent: 78,
  },
  {
    name: 'Thu',
    present: 92,
    absent: 56,
  },
  {
    name: 'Fri',
    present: 58,
    absent: 89,
  },
];

const Attendsance = () => {
  return (
    <div className='bg-white h-full w-full p-4 rounded-xl'>
      {/* TOP */}
      <div className="flex flex-row justify-between">
        <h1 className="capitalize font-semibold">attendance</h1>
        <Image
          src={getImagePath("/moreDark.png")}
          alt="menu options"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
      {/* MIDDLE */}
      {/* <div className='flex flex-row gap-2 my-4'>
      <div className='gap-1 flex flex-row items-center'>
        <div className='w-3 h-3 bg-lamaYellow rounded-full'/>
        <h6 className="text-xs text-lamaYellow">present</h6>
      </div>
      <div className='gap-1 flex flex-row items-center'>
        <div className='w-3 h-3 bg-lamaSky rounded-full'/>
        <h6 className="text-xs text-lamaSky">present</h6>
      </div>
      </div> */}
      {/* BOTTOM */}
      <ResponsiveContainer width={"100%"} height={"90%"}>
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd"/>
          <XAxis axisLine={false} dataKey="name" stroke="#808080" tick={{fill: "#d1d1d1"}} tickLine={false}/>
          <YAxis axisLine={false} stroke="#808080" tick={{fill: "#d1d1d1"}} tickLine={false}/>
          <Tooltip contentStyle={{borderRadius: "10px", borderColor:"lightgray"}}/>
          <Legend align="left" verticalAlign="top"  wrapperStyle={{paddingTop: "20px", paddingBottom: "40px"}}/>
          {/* <Tooltip /> */}
          <Bar 
            dataKey="absent" 
            fill="#C3EBFA" 
            legendType="circle"
            activeBar={<Rectangle stroke="#FAE27C" />}
            radius={[50, 50, 0, 0]} 
            barSize={15}
          />
          <Bar 
            dataKey="present" 
            fill="#FAE27C" 
            legendType="circle"
            activeBar={<Rectangle stroke="#C3EBFA" />}
            radius={[50, 50, 0, 0]} 
            barSize={15}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
  )
}

export default Attendsance