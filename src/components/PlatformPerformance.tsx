'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PlatformPoint } from '@/data/mockData';

type ChartProps = {
  data: PlatformPoint[];
};

const PlatformPerformance = ({ data }: ChartProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold">Platform Performance</h3>
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
          />
          <Bar
            dataKey="mentions"
            fill="#8b5cf6"
            barSize={20}
            radius={[0, 10, 10, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PlatformPerformance;
