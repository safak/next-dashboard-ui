"use client";
import Image from "next/image";
import React from "react";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const data = [
  {
    name: "Male",
    value: 56,
    fill: "#FFD700", // tepaYellow
  },
  {
    name: "Female",
    value: 44,
    fill: "#8A2BE2", // tepaPurple
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl w-full h-full">
      {/* title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Gender Distribution</h2>
        <Image src="/moreDark.png" alt="" height={24} width={24} />
      </div>
      {/* chart */}
      <div className="w-full h-[75%] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={30}
              label={{ position: "insideStart", fill: "#fff", fontSize: 14 }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <Image src="/maleFemale.png" alt="Male" width={60} height={60} />
        </div>
      </div>
      {/* footer */}
      <div className="flex justify-between gap-16 items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-tepaYellow rounded-full h-[15px] w-[15px]"></div>
          <h2 className="font-bold text-lg">1,234</h2>
          <h2 className="text-sm text-gray-500">Male(56%)</h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="bg-tepaPurple rounded-full h-[15px] w-[15px]"></div>
          <h2 className="font-bold text-lg">970</h2>
          <h2 className="text-sm text-gray-500">Female(44%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
