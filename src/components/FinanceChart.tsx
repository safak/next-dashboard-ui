"use client"
import Image from 'next/image'
import React from 'react'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    income: 4000,
    expence: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expence: 1398,
  },
  {
    name: 'Mar',
    income: 2000,
    expence: 9800,
  },
  {
    name: 'Apr',
    income: 2780,
    expence: 3908,
  },
  {
    name: 'May',
    income: 1890,
    expence: 4800,
  },
  {
    name: 'Jun',
    income: 2390,
    expence: 3800,
  },
  {
    name: 'Jul',
    income: 3490,
    expence: 4300,
  },
  {
    name: 'Aug',
    income: 3490,
    expence: 4300,
  },
  {
    name: 'Sep',
    income: 3490,
    expence: 4300,
  },
  {
    name: 'Oct',
    income: 3490,
    expence: 4300,
  },
  {
    name: 'Nov',
    income: 3490,
    expence: 4300,
  },
  {
    name: 'Dec',
    income: 3490,
    expence: 4300,
  },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
        {/* Title */}
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Finance</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20}/>
        </div>
        {/* Chart */}
        <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke='#ddd'/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={10}/>
          <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={20}/>
          <Tooltip />
          <Legend align='center' verticalAlign='top' wrapperStyle={{paddingTop:"10px", paddingBottom:"30px"}}/>
          <Line type="monotone" dataKey="income" stroke="#C3E8FA" strokeWidth={5} />
          <Line type="monotone" dataKey="expence" stroke="#CFCEFF" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinanceChart