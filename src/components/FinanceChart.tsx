"use client";

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
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    expense: 2210,
  },
  {
    name: "Mar",
    income: 2000,
    expense: 2290,
  },
  {
    name: "Apr",
    income: 2780,
    expense: 2000,
  },
  {
    name: "May",
    income: 1890,
    expense: 2181,
  },
  {
    name: "Jun",
    income: 2390,
    expense: 2500,
  },
  {
    name: "Jul",
    income: 3490,
    expense: 2100,
  },
  {
    name: "Aug",
    income: 3490,
    expense: 2100,
  },
  {
    name: "Sep",
    income: 3490,
    expense: 2100,
  },
  {
    name: "Oct",
    income: 3490,
    expense: 2100,
  },
  {
    name: "Nov",
    income: 3490,
    expense: 2100,
  },
  {
    name: "Dec",
    income: 3490,
    expense: 2100,
  },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#c3ebfa"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#cfceff"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
