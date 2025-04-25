"use client";

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
    Income: 4000,
    Expense: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    Income: 3000,
    Expense: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    Income: 2000,
    Expense: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    Income: 2780,
    Expense: 3908,
    amt: 2000,
  },
  {
    name: "May",
    Income: 1890,
    Expense: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    Income: 2390,
    Expense: 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    Income: 3490,
    Expense: 4300,
    amt: 2100,
  },
  {
    name: "Aug",
    Income: 2000,
    Expense: 9800,
    amt: 2290,
  },
  {
    name: "Sept",
    Income: 2780,
    Expense: 3908,
    amt: 2000,
  },
  {
    name: "Oct",
    Income: 1890,
    Expense: 4800,
    amt: 2181,
  },
  {
    name: "Nov",
    Income: 2390,
    Expense: 3800,
    amt: 2500,
  },
  {
    name: "Dec",
    Income: 3490,
    Expense: 4300,
    amt: 2100,
  },
];

import Image from "next/image";

function FinanceChart() {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

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
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
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
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="Income"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="Expense"
            stroke="#cfceff"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FinanceChart;
