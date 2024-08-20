"use client"
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '18-24',
    uv: 31.47,
    pv: 2400,
    fill: '#8884d8',
  },
  {
    name: '25-29',
    uv: 26.69,
    pv: 4567,
    fill: '#83a6ed',
  },
  {
    name: '30-34',
    uv: 15.69,
    pv: 1398,
    fill: '#8dd1e1',
  },
  {
    name: '35-39',
    uv: 8.22,
    pv: 9800,
    fill: '#82ca9d',
  },
  {
    name: '40-49',
    uv: 8.63,
    pv: 3908,
    fill: '#a4de6c',
  },
  {
    name: '50+',
    uv: 2.63,
    pv: 4800,
    fill: '#d0ed57',
  },
  {
    name: 'unknow',
    uv: 6.67,
    pv: 4800,
    fill: '#ffc658',
  },
];
import React from 'react'
import Image from 'next/image';

const CountChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
        {/* tile */}
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Students</h1>
            <Image src='/moreDark.png' alt='' height={20} width={20} />
        </div>
        {/* chart */}
        <div className=''>
        {/* <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
          <RadialBar
            minAngle={15}
            label={{ position: 'insideStart', fill: '#fff' }}
            background
            clockWise
            dataKey="uv"
          />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
        </RadialBarChart>
      </ResponsiveContainer> */}
        </div>
        {/* bottom */}
        <div className=' flex justify-center gap-16'>
          <div className='flex flex-col gap-1'>
            <div className='w-5 h-5 bg-lansSky rounded-full'/>
            <h1 className='font-bold'>1223</h1>
            <h2 className='text-xs text-gray-500'>Boys (55%)</h2>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='w-5 h-5 bg-lansYellowLight rounded-full'/>
            <h1 className='font-bold'>1223</h1>
            <h2 className='text-xs text-gray-500'>Girls (45%)</h2>
          </div>
        </div>
    </div>
  )
}

export default CountChart