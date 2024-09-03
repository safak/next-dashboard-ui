"use client";

import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

const data = [
  {
    name: "SUN",
    present: 70,
    absent: 20,
  },
  {
    name: "MON",
    present: 60,
    absent: 70,
  },
  {
    name: "TUE",
    present: 40,
    absent: 30,
  },
  {
    name: "WED",
    present: 70,
    absent: 29,
  },
  {
    name: "THU",
    present: 50,
    absent: 40,
  },
  {
    name: "FRI",
    present: 70,
    absent: 20,
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Attendance</h1>
        <Image src="/moreDark.png" alt="" height={24} width={24} />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barSize={15} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f5f5f5",
              border: "none",
              borderRadius: 10,
            }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: 20, paddingBottom: 20 }}
          />
          <Bar
            dataKey="present"
            fill="#87CEEB"
            name="Present"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#FAE27C"
            name="Absent"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />{" "}
          {/* Changed to a darker yellow (#FFD700) for better visibility */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
