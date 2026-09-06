import Image from "next/image";

const TableSearch = () => {
  return (
    <div className=" w-full md:w-autp items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 p-2 flex">
      <Image src="/search.png" alt="searh" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] bg-transparent p-2 outline-none"
      />
    </div>
  );
};

export default TableSearch;
