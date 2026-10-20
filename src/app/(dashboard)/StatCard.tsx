"use client";

import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  color?: "green" | "blue";
  chartData?: { value: number }[];
  icon?: "attendance" | "results";
}

const colors = {
  green: {
    stroke: "#22c55e",
    gradientStart: "#22c55e",
  },
  blue: {
    stroke: "#0ea5e9",
    gradientStart: "#0ea5e9",
  },
};

const iconMap = {
  attendance: CalendarCheck,
  results: GraduationCap,
};

const StatCard = ({
  title,
  subtitle,
  value,
  trend,
  trendDirection = "up",
  color = "green",
  chartData = [
    { value: 40 },
    { value: 55 },
    { value: 50 },
    { value: 70 },
    { value: 65 },
    { value: 80 },
  ],
  icon,
}: Props) => {
  const chartColor = colors[color];
  const Icon = icon ? iconMap[icon] : null;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-3 flex justify-between items-start">
      {/* LEFT SIDE */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-gray-600">
          {Icon && <Icon size={14} className="opacity-70" />}
          <p className="text-sm font-medium">{title}</p>
        </div>

        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}

        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>

        {trend && (
          <div
            className={`flex items-center gap-1 text-xs mt-2 font-medium whitespace-nowrap ${
              trendDirection === "up"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {trendDirection === "up" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend}
          </div>
        )}
      </div>

      {/* RIGHT SPARKLINE */}
      <div className="w-24 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`spark-${color}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartColor.gradientStart}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={chartColor.gradientStart}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor.stroke}
              strokeWidth={2}
              fill={`url(#spark-${color})`}
              dot={false}
              isAnimationActive
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatCard;