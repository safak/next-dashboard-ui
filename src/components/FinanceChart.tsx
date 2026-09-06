"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import Image from "next/image";
const data = [
  {
    name: "Jan",
    Income: 103,
    Expense: 90,
  },
  {
    name: "Feb",
    Income: 50,
    Expense: 70,
  },
  {
    name: "Mar",
    Income: 53,
    Expense: 59,
  },
  {
    name: "Apr",
    Income: 103,
    Expense: 90,
  },
  {
    name: "May",
    Income: 50,
    Expense: 70,
  },
  {
    name: "Jun",
    Income: 53,
    Expense: 59,
  },
  {
    name: "Jul",
    Income: 103,
    Expense: 90,
  },
  {
    name: "Aug",
    Income: 50,
    Expense: 20,
  },
  {
    name: "Sep",
    Income: 70,
    Expense: 100,
  },
  {
    name: "Oct",
    Income: 103,
    Expense: 44,
  },
  {
    name: "Nov",
    Income: 42,
    Expense: 90,
  },
  {
    name: "Dec",
    Income: 66,
    Expense: 59,
  },
];
const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* //TITLE --------------------------------------------*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <LineChart
        style={{
          width: "100%",
          height: "90%",
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
          dataKey="name"
          stroke="var(--color-text-3) "
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
          width="auto"
          stroke="var(--color-text-3)"
        />
        <Tooltip
          cursor={{
            stroke: "var(--color-border-2)",
          }}
          contentStyle={{
            backgroundColor: "var(--color-surface-raised)",
            borderColor: "var(--color-border-2)",
          }}
        />
        <Legend
          align="center"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
        />{" "}
        <Line
          type="monotone"
          dataKey="Income"
          stroke="#ddd555"
          dot={{
            fill: "var(--color-surface-base)",
          }}
          activeDot={{ r: 8, stroke: "var(--color-surface-base)" }}
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="Expense"
          stroke="#C3EBFA"
          dot={{
            fill: "var(--color-surface-base)",
          }}
          activeDot={{ stroke: "var(--color-surface-base)" }}
          strokeWidth={3}
        />
        <RechartsDevtools />
      </LineChart>
    </div>
  );
};
export default FinanceChart;
