"use client";

import Image from "next/image";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Current Limitations / Things to Improve
 * ---------------------------------------
 * 1️⃣ Static Sample Data
 *    - `data` is hard-coded. In production you’ll want to fetch daily counts
 *      (e.g., Pending vs. Resolved reports) from your backend or database.
 *
 * 2️⃣ Data Keys Mismatch
 *    - Bars expect `Pending` and `Resolved` keys, but sample objects
 *      only have `reports`. Without matching keys, bars render empty.
 *      Make sure your fetched data includes those exact fields.
 *
 * 3️⃣ No Error / Loading States
 *    - If data is empty or fetch fails, nothing appears.
 *      You may want a skeleton loader or a “No Data” placeholder.
 *
 * 4️⃣ Accessibility
 *    - Charts have no ARIA labels or descriptions.
 *      Add them for screen-reader users.
 *
 * 5️⃣ Mobile Responsiveness
 *    - `ResponsiveContainer` handles most resizing,
 *      but you may need min-height CSS tweaks for very small screens.
 *
 * 6️⃣ Next.js Image
 *    - The `/moreDark.png` path assumes a public folder asset.
 *      Ensure the file exists and is optimized for light/dark themes.
 */

const data = [
  // ✅ Replace with real backend data shaped like:
  // { name: "Mon", Pending: number, Resolved: number }
  { name: "Mon", Pending: 8, Resolved: 7 },
  { name: "Tue", Pending: 10, Resolved: 12 },
  { name: "Wed", Pending: 5, Resolved: 7 },
  { name: "Thu", Pending: 15, Resolved: 13 },
  { name: "Fri", Pending: 6, Resolved: 13 },
  { name: "Sat", Pending: 12, Resolved: 13 },
//   { name: "Sun", Pending: 3, Resolved: 7 },
];

export default function ReportChart() {
  return (
    <div className="bg-white rounded-lg p-4 h-full shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Daily Report Flow</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={15}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "20px" }}
          />
          <Bar
            dataKey="Pending"
            fill="#f2b422"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="Resolved"
            fill="#22f2a2"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
