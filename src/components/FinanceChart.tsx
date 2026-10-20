"use client";

import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type FinanceChartData = {
  month: string;
  fees: number;
};

interface FinanceChartProps {
  data: FinanceChartData[];
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
};

export default function FinanceChart({ data }: FinanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <TrendingUp className="mb-3 h-10 w-10 text-gray-300" />

        <h3 className="text-sm font-semibold text-gray-700">
          No Collection Data
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Fee payments will appear here once collections are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Chart */}
      <div className="h-[280px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 15,
              left: 5,
              bottom: 10,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E5E7EB"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{
                fill: "#6B7280",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={55}
              tick={{
                fill: "#6B7280",
                fontSize: 12,
              }}
              tickFormatter={formatCurrency}
            />

            <Tooltip
              cursor={{
                stroke: "#10B981",
                strokeDasharray: "4 4",
              }}
              formatter={(value) => {
                const amount = Number(value ?? 0);

                return [
                  `₹${amount.toLocaleString("en-IN")}`,
                  "Collected",
                ] as const;
              }}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                border: "none",
                borderRadius: 12,
                boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                padding: "10px 14px",
                fontSize: "13px",
              }}
            />

            <Line
              type="monotone"
              dataKey="fees"
              stroke="#10B981"
              strokeWidth={3.5}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
              dot={{
                r: 4,
                fill: "#FFFFFF",
                stroke: "#10B981",
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: "#FFFFFF",
                stroke: "#10B981",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
