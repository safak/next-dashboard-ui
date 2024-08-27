import UserCards from "@/components/UserCards";
import React from "react";
import CountChart from "@/components/CountChart";
import AttendanceChart from "@/components/AttendanceChart";
import FinanceChart from "@/components/FinanceChart";
const AdminPage = () => {
  return (
    <div className=" flex p-4 gap-4 flex-col md:flex-row ">
      {/* Left */}
      <div className=" w-full lg:w-2/3 flex flex-col gap-8">
        <div className=" flex gap-4 justify-between items-center flex-wrap">
          <UserCards types="students" />
          <UserCards types="teacher" />
          <UserCards types="parents" />
          <UserCards types="staff" />
        </div>
        <div className=" flex gap-4 flex-col lg:flex-row">
          {/* Count Chart */}
          <div className=" w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* Attendance Chart */}
          <div className=" w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        <div className=" w-full h-[450px]">
          <FinanceChart />
        </div>
      </div>
      {/* Right */}
      <div className=" w-full lg:w-1/3">r</div>
    </div>
  );
};

export default AdminPage;
