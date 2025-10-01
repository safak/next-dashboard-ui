"use client";

import Image from "next/image";
import {
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const data = [
  { name: "Total Complaints", value: 45, color: "#bef222" },
  { name: "Resolved ", value: 35, color: "#22f2bb" },
  { name: "Pending ", value: 20, color: "#f25922" },
];

export default function CountChart() {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Complaints</h1>
        <Image src="/moreDark.png" alt="options" width={20} height={20} />
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="50%"          // donut style
              paddingAngle={4}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
