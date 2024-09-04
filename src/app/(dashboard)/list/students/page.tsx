"use client";
import React, { useState } from "react";
import TableSearch from "@/components/TableSerach";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import StudentsTable from "@/components/StudentsTable";

const StudentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-2xl font-bold">Students</h1>
        <div className="flex fel-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="hidden md:flex items-center gap-4 self-end">
            <button className="bg-purple-700 text-white px-4 py-2 rounded-full">
              <Image src="/filter.png" alt="filter" height={14} width={14} />
            </button>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-full">
              <Image src="/plus.png" alt="add" height={14} width={14} />
            </button>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-full">
              <Image src="/sort.png" alt="sort" height={14} width={14} />
            </button>
          </div>
        </div>
      </div>
      {/* List */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <StudentsTable searchTerm={searchTerm} />
          </div>
        </div>
      </div>
      {/* pagination */}
      <Pagination />
    </div>
  );
};

export default StudentsList;
