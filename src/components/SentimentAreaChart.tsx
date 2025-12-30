'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AnalyticPoint } from '@/data/mockData';

type ChartProps = {
  data: AnalyticPoint[];
};

const SentimentAreaChart = ({ data }: ChartProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold">Mentions by Sentiment</h3>
    <div className="h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          {/* ... all the <defs> and gradient code from your example ... */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
          />
          <Area
            type="monotone"
            dataKey="Positive"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorPositive)"
          />
          <Area
            type="monotone"
            dataKey="Neutral"
            stroke="#facc15"
            fillOpacity={1}
            fill="url(#colorNeutral)"
          />
          <Area
            type="monotone"
            dataKey="Negative"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorNegative)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default SentimentAreaChart;
