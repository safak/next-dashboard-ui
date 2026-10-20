"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

type AttendanceData = {
  name: string;
  present: number;
  absent: number;
};

const AttendanceChart = ({ data }: { data: AttendanceData[] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        barSize={isMobile ? 10 : 20}
        margin={{
          top: isMobile ? 6 : 20,
          right: 10,
          left: isMobile ? -10 : 0,
          bottom: isMobile ? 0 : 10,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e5e7eb"
        />

        <XAxis
          dataKey="name"
          interval={0}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#9ca3af",
            fontSize: isMobile ? 10 : 12,
          }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          width={isMobile ? 24 : 40}
          tick={{
            fill: "#9ca3af",
            fontSize: isMobile ? 10 : 12,
          }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            borderColor: "#e5e7eb",
            fontSize: 12,
          }}
        />

        <Legend
          align="center"
          verticalAlign="top"
          iconType="circle"
          wrapperStyle={{
            paddingTop: isMobile ? 2 : 10,
            paddingBottom: isMobile ? 20 : 24,
            fontSize: isMobile ? 10 : 16,
          }}
        />

        <Bar
          dataKey="present"
          fill="#FDA4AF"
          radius={[6, 6, 0, 0]}
        />

        <Bar
          dataKey="absent"
          fill="#D8B4FE"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
