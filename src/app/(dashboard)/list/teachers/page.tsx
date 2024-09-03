import TableSearch from "@/components/TableSerach";
import Image from "next/image";
import React from "react";
import Pagination from "@/components/Pagination";
import TeacherTable from "@/components/TeacherTable";
const TeacherList = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-2xl font-bold">Teachers</h1>
        <div className=" flex fel-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className=" flex items-center gap-4 self-end">
            <button className=" bg-purple-700 text-white px-4 py-2 rounded-full">
              <Image src="/filter.png" alt="filter" height={14} width={14} />
            </button>
            <button className=" bg-purple-700 text-white px-4 py-2 rounded-full">
              <Image src="/plus.png" alt="filter" height={14} width={14} />
            </button>
            <button className=" bg-purple-700 text-white px-4 py-2 rounded-full">
              <Image src="/sort.png" alt="filter" height={14} width={14} />
            </button>
          </div>
        </div>
      </div>
      {/* Listt */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <TeacherTable />
          </div>
        </div>
      </div>
      {/* pagination */}
      <Pagination />
    </div>
  );
};

export default TeacherList;
