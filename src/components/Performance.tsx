"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Half-donut gauge of an average score out of 100
const Performance = ({
  average,
  count,
}: {
  average: number | null;
  count: number;
}) => {
  const value = average ?? 0;
  const data = [
    { name: "score", value },
    { name: "rest", value: 100 - value },
  ];

  return (
    <div className="card p-4 h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <span className="text-xs text-gray-400">average score</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            stroke="#fff"
            strokeWidth={2}
            isAnimationActive={false}
          >
            <Cell fill="#0284c7" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">
          {average === null ? "—" : average.toFixed(1)}
        </h1>
        <p className="text-xs text-gray-400">out of 100</p>
      </div>
      <h2 className="font-medium text-sm text-gray-500 absolute bottom-16 left-0 right-0 m-auto text-center">
        {count === 0
          ? "No graded results yet"
          : `Based on ${count} graded result${count === 1 ? "" : "s"}`}
      </h2>
    </div>
  );
};

export default Performance;
