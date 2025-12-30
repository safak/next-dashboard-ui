'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Define prop types to accept data from your page
type ChartDataItem = {
  name: string;
  count: number;
  fill: string;
};

type CategoryBreakdownProps = {
  chartData: ChartDataItem[];
  chartConfig: ChartConfig;
};

const CategoryBreakdown = ({
  chartData,
  chartConfig,
}: CategoryBreakdownProps) => {
  // Get legend data from the config
  const legendData = Object.entries(chartConfig)
    .filter(([key]) => key !== 'count') // Remove the generic 'count' label
    .map(([key, value]) => ({
      name: (value as { label: string }).label,
      color: (value as { color: string }).color,
    }));

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Based on all collected posts</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[350px] w-full" // Increased height for horizontal bars
        >
          {/* 1. Swapped to a horizontal layout */}
          <BarChart
            data={chartData}
            layout="vertical" // This makes it a horizontal bar chart
            margin={{ left: 50, top: 5, right: 30, bottom: 5 }} // Add margins for labels
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-black" // Make labels smaller
              width={120} // Give more space for labels
              // Truncate long labels to prevent overflow
              // tickFormatter={(value) =>
              //   value.length > 20 ? `${value.substring(0, 20)}...` : value
              // }
            />
            {/* <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              content={
                <ChartTooltipContent
                  labelKey="name"
                  nameKey="count"
                  hideLabel
                />
              }
            /> */}
            <Bar dataKey="count" radius={4}>
              {/* 2. This maps over your data to color each bar individually */}
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              {/* 3. This adds the count label to the end of the bar */}
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground text-xs"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      {/* 4. The legend in the footer remains the same */}
      {/* <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          {legendData.map((category) => (
            <div key={category.name} className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              ></span>
              <span className="text-sm text-gray-700">{category.name}</span>
            </div>
          ))}
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default CategoryBreakdown;
