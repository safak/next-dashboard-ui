'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SentimentPoint } from '@/data/mockData';

type ChartProps = {
  data: SentimentPoint[];
};

const SentimentChart = ({ data }: ChartProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-bold mb-4">Sentiment Over Time</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
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
          <Line
            type="monotone"
            dataKey="Positive"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Neutral"
            stroke="#facc15"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Negative"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default SentimentChart;
