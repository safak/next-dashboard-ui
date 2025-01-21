"use client"

import Image from "next/image"
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'Feb',
    income: 36000,
    expense: 1398,
  },
  {
    name: 'Mar',
    income: 20000,
    expense: 9800,
  },
  {
    name: 'Apr',
    income: 22780,
    expense: 3908,
  },
  {
    name: 'May',
    income: 18690,
    expense: 4800,
  },
  {
    name: 'Jun',
    income: 23290,
    expense: 3800,
  },
  {
    name: 'Jul',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Aug',
    income: 38490,
    expense: 4300,
  },
  {
    name: 'Sep',
    income: 34980,
    expense: 4300,
  },
  {
    name: 'Oct',
    income: 7490,
    expense: 4300,
  },
  {
    name: 'Nov',
    income: 340,
    expense: 4300,
  },
  {
    name: 'Dec',
    income: 34950,
    expense: 4300,
  },
];

const Financechart = () => {
  return (
  
     <div className='bg-white rounded-lg p-4 h-full'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-semibold '>Finance</h1>
                    <Image src="/moreDark.png" alt='' width={20} height={20}/>
                </div>
         <ResponsiveContainer width="100%" height="90%">
          <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 40,
            left: 40,
            bottom: 5,
          }} >
         
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" tickMargin={10} tickSize={10}/>
          <YAxis tickMargin={30} tickSize={10} />
          <Tooltip />
          <Legend align="left" verticalAlign='top' wrapperStyle={{paddingTop:"20px",paddingBottom:"40px"}} />
          <Line type="monotone" dataKey="income" stroke="#8884d8" strokeWidth={3}   />
          <Line type="monotone" dataKey="expense" stroke="#90caf9" strokeWidth={3}  />
         </LineChart>
         </ResponsiveContainer>
      </div>       
   )
}

export default Financechart