'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { allModelsData, modelList } from '@/data/modelEvaluationData';

// 1. Process data for *only* accuracy
const chartData = modelList.map((modelName) => {
  const modelData = allModelsData[modelName];
  return {
    name: modelName,
    accuracy: modelData.summary.accuracy,
    // f1 score removed
  };
});

// 2. Configure *only* the accuracy bar and set its color to purple
const chartConfig = {
  accuracy: {
    label: 'Accuracy',
    color: 'hsl(var(--primary))', // This uses your primary purple theme color
  },
} satisfies ChartConfig;

const ModelComparisonChart = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Model Performance Comparison (Accuracy)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0.4, 1]} // Set Y-axis from 0.4 to 1.0
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {/* 3. Render *only* the accuracy bar */}
            <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ModelComparisonChart;
