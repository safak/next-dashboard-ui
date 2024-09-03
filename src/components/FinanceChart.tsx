"use client";
import React from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    income: 4000,
    cost: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    cost: 1398,
  },
  {
    name: "Mar",
    income: 2000,
    cost: 9800,
  },
  {
    name: "Apr",
    income: 2780,
    cost: 3908,
  },
  {
    name: "May",
    income: 1890,
    cost: 4800,
  },
  {
    name: "Jun",
    income: 2390,
    cost: 3800,
  },
  {
    name: "Jul",
    income: 3490,
    cost: 4300,
  },
  {
    name: "Aug",
    income: 4000,
    cost: 2400,
  },
  {
    name: "Sep",
    income: 3000,
    cost: 1398,
  },
  {
    name: "Oct",
    income: 2000,
    cost: 9800,
  },
  {
    name: "Nov",
    income: 2780,
    cost: 3908,
  },
  {
    name: "Dec",
    income: 1890,
    cost: 4800,
  },
];
const FinanceChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Attendance</h1>
        <Image src="/moreDark.png" alt="" height={24} width={24} />
      </div>
      {/* Animated Chart */}

      <ResponsiveContainer width="100%" height="100%">
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
          <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
          <XAxis dataKey="name" tickLine={false} />
          <YAxis tickLine={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 7 }}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#82ca9d"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
