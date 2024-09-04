"use client";

import React from "react";
import EventCalender from "@/components/EventCalender";
import Announcements from "@/components/Announcements";
import BigCalender from "@/components/BigCalender";
import { Button } from "@/components/ui/button";

const ParentsPage = () => {
  return (
    <div className="p-4 gap-4 flex flex-col xl:flex-row flex-1">
      {/* Left */}
      <div className=" w-full xl:w-2/3">
        <div className=" p-4 bg-white rounded-md">
          <h1 className=" text-2xl font-bold">Class 1A</h1>
        </div>
        <BigCalender />
      </div>
      {/* Right */}
      <div className=" w-full xl:w-1/3 flex flex-col gap-4">
        <Announcements />
        <Button>Add Event</Button>
      </div>
    </div>
  );
};

export default ParentsPage;
