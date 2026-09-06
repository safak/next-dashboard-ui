"use client";
import {
  BarChart,
  Bar,
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
    name: "Sat",
    Present: "70",
    Absent: "20",
  },
  {
    name: "Sun",
    Present: "80",
    Absent: "50",
  },
  {
    name: "Mon",
    Present: "60",
    Absent: "10",
  },
  {
    name: "Tue",
    Present: "80",
    Absent: "33",
  },
  {
    name: "Wed",
    Present: "80",
    Absent: "80",
  },
  {
    name: "Thu",
    Present: "70",
    Absent: "55",
  },
  {
    name: "Fri",
    Present: "20",
    Absent: "10",
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <BarChart
        style={{
          height: "90%",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "80vh",
          aspectRatio: 1.618,
        }}
        height={300}
        width={500}
        responsive
        data={data}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <YAxis
          width="auto"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
        />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
        />
        <Bar
          dataKey="Present"
          fill="#FAE27C"
          activeBar={{ fill: "pink", stroke: "blue" }}
          radius={[20, 20, 0, 0]}
          legendType="circle"
        />
        <Bar
          dataKey="Absent"
          fill="#C3EBFA"
          activeBar={{ fill: "gold", stroke: "purple" }}
          radius={[20, 20, 0, 0]}
          legendType="circle"
        />
        <RechartsDevtools />
      </BarChart>
    </div>
  );
};
export default AttendanceChart;
