"use client";

import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const total = boys + girls;

  const data = [
    { name: "Boys", count: boys, fill: "#C4B5FD" },
    { name: "Girls", count: girls, fill: "#FDA4AF" },
  ];

  return (
    /* HARD CLAMP */
    <div className="relative w-full max-w-full overflow-hidden mb-0">
      {/* SAFETY WRAPPER */}
      <div className="mx-auto max-w-[350px] h-[220px] sm:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="88%"  
            barSize={16}
            data={data}
          >
            <RadialBar
              dataKey="count"
              background={{ fill: "#F1F5F9" }}
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Image src="/pictogram.png" alt="gender" width={35} height={35} />
          <p className="text-[16px] text-gray-500 mt-1 font-bold">Total</p>
          <p className="text-xl font-semibold text-gray-900">{total}</p>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
