'use client';
import Image from 'next/image';
import { count } from 'node:console';
import React, { PureComponent } from 'react';
// Remove the commented import since we're using a functional component
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Total',
    count: 106,
    fill: 'white',
  },
  {
    name: 'Girls',
    count: 53,
    fill: '#fae27c',
  },
  {
    name: 'Boys',
    count: 53,
    fill: '#C3EBFA',
  },
];

// Properly define the functional component with React.FC type
const CountChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 ">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Student</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className=" relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="">
          <div className="w-5 h-5 bg-lamaSky rounded-full"></div>
          <h1 className="bold">1234</h1>
          <h2 className="text-xs text-gary-300"> Boys(55%)</h2>
        </div>
        <div className="">
          <div className="w-5 h-5 bg-lamaYellow rounded-full"></div>
          <h1 className="bold">1234</h1>
          <h2 className="text-xs text-gary-300"> Girls(45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
