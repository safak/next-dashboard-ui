'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type SentimentData = {
  name: string;
  value: number;
  fill: string;
};

type Props = {
  data: SentimentData[];
};

const defaultData = [
  { name: 'Positive', value: 450, fill: '#22c55e' }, // Green
  { name: 'Neutral', value: 200, fill: '#eab308' }, // Yellow
  { name: 'Negative', value: 50, fill: '#ef4444' }, // Red
];

const SentimentOverview = ({ data }: Props) => {
  const hasRealData = data && data.some((item) => item.value > 0);
  const chartData = hasRealData ? data : defaultData;

  // --- FIX 1: Calculate total using chartData (Safe) ---
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Transform data for Recharts
  const transformedData = [
    {
      name: 'Total',
      ...Object.fromEntries(chartData.map((item) => [item.name, item.value])),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Overall Sentiment Breakdown
      </h3>

      <div className="flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            layout="horizontal"
            stackOffset="expand"
            barSize={30}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" hide dataKey="name" />
            <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number, name: string) => {
                const percent = (value / total) * 100;
                return [
                  `${value.toLocaleString()} (${percent.toFixed(1)}%)`,
                  name,
                ];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
              // --- FIX 2: Look up value from chartData instead of transformedData ---
              formatter={(value: string) => {
                const item = chartData.find((i) => i.name === value);
                const val = item ? item.value : 0;
                const percent = (val / total) * 100;
                return (
                  <span className="text-sm text-gray-600 ml-1">
                    {value} ({percent.toFixed(1)}%)
                  </span>
                );
              }}
            />

            {chartData.map((item) => (
              <Bar
                key={item.name}
                dataKey={item.name}
                stackId="a"
                fill={item.fill}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <div className="text-center mt-4">
          <span className="text-xl font-bold text-gray-800">
            {total.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 font-medium ml-2">
            Total Comments/Posts Analyzed
          </span>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;
