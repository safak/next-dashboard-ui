"use client"
import Image from 'next/image';
import React, { PureComponent } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name:'Total',
        count:'180',
        fill:'white',
    }, 
  {
    name: 'Girls',
    count: 70,
    fill: '#b388ff',
  },
  {
    name: 'Boys',
    count: 110,
    fill: '#90caf9',
  },
];
const Countchart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4 '>
        {/*TITLE*/}
        <div className='flex justify-between items-center'>
            <h1 className='text-xl font-semibold'>Students</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20}/>
        </div>
        {/*CHART*/}
        <div className='relative w-full h-[75%]'>
    
      <ResponsiveContainer>
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="110%" barSize={60} data={data}>
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff' }}
            background
            dataKey="count"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src='/maleFemale.png' alt='' width={50} height={50} className='absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2'/>
    
        </div>
        {/*BOTTOM*/}
        <div className='flex justify-center gap-16'>
            <div className='flex flex-col gap-2'>
                <div className='w-5 h-5 bg-[#90caf9] rounded-full'></div>
                <h1 className='font-bold'>1,234</h1>
                <h2 className='text-xs text-gray-500'>Boys (55%)</h2>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='w-5 h-5 bg-[#b388ff] rounded-full'></div>
                <h1 className='font-bold'>1,234</h1>
                <h2 className='text-xs text-gray-500'>Girls (45%)</h2>
            </div>

        </div>
    </div>
  )
}

export default Countchart