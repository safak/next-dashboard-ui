import UserCards from "@/components/UserCards";
import React from "react";

const AdminPage = () => {
  return (
    <div className=" flex p-4 gap-4 flex-col md:flex-row ">
      {/* Left */}
      <div className=" w-full lg:w-2/3">
        <div className=" flex gap-4 justify-between items-center flex-wrap">
          <UserCards types="students" />
          <UserCards types="teacher" />
          <UserCards types="parents" />
          <UserCards types="staff" />
        </div>
      </div>
      {/* Right */}
      <div className=" w-full lg:w-1/3">r</div>
    </div>
  );
};

export default AdminPage;
