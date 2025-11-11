import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import React from "react";

const AdminPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full lg:w-2/3 ">
          <div className="flex gap-4 flex-warp">
            <UserCard type="students" />
            <UserCard type="teachers" />
            <UserCard type="parents" />
            <UserCard type="staffs" />
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          <div className="w-full h-[500px]">
            <FinanceChart />
          </div>
        </div>
      </div>

      {/**Right */}
      <div className="w-full lg:w-1/3"></div>
    </div>
  );
};

export default AdminPage;
