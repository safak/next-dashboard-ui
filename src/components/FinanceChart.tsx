import React from "react";
import Image from "next/image";
const FinanceChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Attendance</h1>
        <Image src="/moreDark.png" alt="" height={24} width={24} />
      </div>
    </div>
  );
};

export default FinanceChart;
