"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Validated pair (CVD-safe, >=3:1 on white): blue = exams, amber = assignments
const EXAM_COLOR = "#0284c7";
const ASSIGNMENT_COLOR = "#d97706";

export type ScorePoint = {
  month: string;
  exams: number | null;
  assignments: number | null;
};

const ScoreTrendChart = ({ data }: { data: ScorePoint[] }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-400">
        No graded results yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={false}
          tickMargin={10}
          width={40}
        />
        <Tooltip
          formatter={(value) =>
            typeof value === "number" ? `${value.toFixed(1)} / 100` : "—"
          }
          contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 12 }}
        />
        <Legend
          align="center"
          verticalAlign="top"
          wrapperStyle={{ paddingBottom: "20px", fontSize: 12 }}
        />
        <Line
          type="monotone"
          name="Exams"
          dataKey="exams"
          stroke={EXAM_COLOR}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 5 }}
          connectNulls
        />
        <Line
          type="monotone"
          name="Assignments"
          dataKey="assignments"
          stroke={ASSIGNMENT_COLOR}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreTrendChart;
