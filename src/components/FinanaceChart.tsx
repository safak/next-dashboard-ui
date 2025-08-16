"use client";

import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    expense: 4000,
    income: 2400,
  },
  {
    name: 'Feb',
    expense: 3000,
    income: 1398,
  },
  {
    name: 'Mar',
    expense: 2000,
    income: 9800,
  },
  {
    name: 'Apr',
    expense: 2780,
    income: 3908,
  },
  {
    name: 'May',
    expense: 1890,
    income: 4800,
  },
  {
    name: 'Jun',
    expense: 2390,
    income: 3800,
  },
  {
    name: 'Jul',
    expense: 3490,
    income: 4300,
  },
  {
    name: 'Aug',
    expense: 3200,
    income: 4100,
  },
  {
    name: 'Sep',
    expense: 2800,
    income: 3700,
  },
  {
    name: 'Oct',
    expense: 3100,
    income: 4500,
  },
  {
    name: 'Nov',
    expense: 3600,
    income: 5200,
  },
  {
    name: 'Dec',
    expense: 4200,
    income: 6100,
  },
];

const FinanaceChart = () => {
  return (
    <div className='bg-white h-full w-full p-4 rounded-xl'>
        <div className="flex flex-row justify-between">
        <h1 className="capitalize font-semibold">Finanace</h1>
        <Image
          src={getImagePath("/moreDark.png")}
          alt="menu options"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd"/>
          <XAxis dataKey="name" axisLine={false} stroke="#808080" tick={{fill: "#d1d1d1"}} tickLine={false} tickMargin={10}/>
          <YAxis axisLine={false} stroke="#808080" tick={{fill: "#d1d1d1"}} tickLine={false} tickMargin={20}/>
          <Tooltip contentStyle={{borderRadius: "10px", borderColor:"lightgray"}}/>
          <Legend align="center" verticalAlign="top"
            wrapperStyle={{paddingTop: "10px", paddingBottom: "20px"}}
          />
          <Line type="monotone" dataKey="income" stroke="#C3EBFA" activeDot={{ r: 8 }} strokeWidth={5}/>
          <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinanaceChart