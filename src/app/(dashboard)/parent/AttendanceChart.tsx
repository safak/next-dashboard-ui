"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

type DataType = {
  month: string;
  percent: number | null;
};

export default function AttendanceChart({
  data,
}: {
  data: DataType[];
}) {
  const formattedData = data.map((d) => ({
    ...d,
    percent: d.percent ?? 0,
  }));

  return (
    <div className="w-full h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <defs>
            {/* Stronger Line Gradient */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Deeper Area Fill */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333EA" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#9333EA" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(value) =>
              typeof value === "number"
                ? [`${value}%`, "Attendance"]
                : ["0%", "Attendance"]
            }
            contentStyle={{
              borderRadius: "14px",
              border: "none",
              boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            }}
          />

          {/* Area Fill */}
          <Area
            type="monotone"
            dataKey="percent"
            stroke="none"
            fill="url(#areaGradient)"
          />

          {/* Main Line */}
          <Line
            type="monotone"
            dataKey="percent"
            stroke="url(#lineGradient)"
            strokeWidth={4}
            dot={{
              r: 5,
              strokeWidth: 2,
              fill: "#fff",
            }}
            activeDot={{
              r: 7,
              stroke: "#9333EA",
              strokeWidth: 3,
              fill: "#fff",
            }}
            isAnimationActive
            animationDuration={1400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}