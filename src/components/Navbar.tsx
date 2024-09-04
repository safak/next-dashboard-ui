import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className=" flex items-center justify-between p-4">
      {/* Search bar */}
      <div className="hidden md:flex  items-center rounded-full gap-2 px-2 ring-[1.5px] ring-gray-300 text-xs  ">
        <Image src="/search.png" alt="serach" height={20} width={20} />
        <input
          type="text"
          placeholder=" Search "
          className=" w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* iocns and user button */}
      <div className="flex items-center justify-end  gap-6 w-full">
        <div className=" bg-white rounded-full flex items-center justify-center w-7 h-7 cursor-pointer relative">
          <Image src="/message.png" alt="message" height={20} width={20} />
          <div className="absolute  -top-3 -right-3 bg-purple-700 w-5 h-5 flex items-center  text-white justify-center rounded-full text-xs ">
            1
          </div>
        </div>
        <div className=" bg-white flex cursor-pointer h-7 w-7 items-center justify-center rounded-full">
          <Image src="/announcement.png" alt="message" height={20} width={20} />
        </div>
        <div className=" flex flex-col">
          <span className=" text-sm leading-3 font-semibold ">John Doe</span>
          <span className=" text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image
          src="/avatar.png"
          alt="avatar"
          height={20}
          width={20}
          className=" rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
