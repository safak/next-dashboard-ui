import React from "react";
import Image from "next/image";

interface TableSearchProps {
  onSearch: (searchTerm: string) => void;
}

const TableSearch: React.FC<TableSearchProps> = ({ onSearch }) => {
  return (
    <div className="w-full md:w-auto flex items-center rounded-full gap-2 px-2 ring-[1.5px] ring-gray-300 text-xs">
      <Image src="/search.png" alt="search" height={20} width={20} />
      <input
        type="text"
        placeholder="Search"
        className="w-[200px] p-2 bg-transparent outline-none"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default TableSearch;
