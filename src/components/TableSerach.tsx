import React from "react";
import Image from "next/image";

const TableSearch = () => {
  return (
    <div className=" w-full md:w-auto flex  items-center rounded-full gap-2 px-2 ring-[1.5px] ring-gray-300 text-xs  ">
      <Image src="/search.png" alt="serach" height={20} width={20} />
      <input
        type="text"
        placeholder=" Search "
        className=" w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
