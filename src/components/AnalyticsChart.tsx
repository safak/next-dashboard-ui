"use client"

// analyticsData.ts

 const data = [
  {
    name: "Jan",
    totalComplaints: 120,
    resolved: 90,
    pending: 30,
  },
  {
    name: "Feb",
    totalComplaints: 140,
    resolved: 100,
    pending: 40,
  },
  {
    name: "Mar",
    totalComplaints: 180,
    resolved: 150,
    pending: 30,
  },
  {
    name: "Apr",
    totalComplaints: 160,
    resolved: 120,
    pending: 40,
  },
  {
    name: "May",
    totalComplaints: 200,
    resolved: 170,
    pending: 30,
  },
  {
    name: "Jun",
    totalComplaints: 220,
    resolved: 180,
    pending: 40,
  },
  {
    name: "Jul",
    totalComplaints: 190,
    resolved: 140,
    pending: 50,
  },
  {
    name: "Aug",
    totalComplaints: 210,
    resolved: 160,
    pending: 50,
  },
  {
    name: "Sep",
    totalComplaints: 230,
    resolved: 190,
    pending: 40,
  },
  {
    name: "Oct",
    totalComplaints: 250,
    resolved: 200,
    pending: 50,
  },
  {
    name: "Nov",
    totalComplaints: 240,
    resolved: 190,
    pending: 50,
  },
  {
    name: "Dec",
    totalComplaints: 260,
    resolved: 210,
    pending: 50,
  },
];

import Image from "next/image"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AnalyticsChart = () => {
    return(
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold">Analytics</h1>
                    <Image src="/moreDark.png" alt="options" width={20} height={20} />
                  </div>
            <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="totalComplaints"
            stroke="#22f2f2"
            strokeWidth={5}
          />
          <Line 
          type="monotone"
           dataKey="resolved" 
           stroke="#22f248" 
           strokeWidth={5}/>
          <Line 
          type="monotone"
           dataKey="pending" 
           stroke="#f2e122" 
           strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
        </div>
    )
}
export default AnalyticsChart