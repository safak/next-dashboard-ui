import Image from "next/image";
import React from "react";

const UserCards = ({ types }: { types: string }) => {
  return (
    <div className=" rounded-2xl odd:bg-tepaPurple even:bg-tepaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex items-center justify-between">
        <span className=" text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          04/22
        </span>
        <Image src="/more.png" alt="more" height={20} width={20} />
      </div>
      <h2 className="my-4 font-semibold text-2xl">1,234</h2>
      <h2 className=" capitalize font-medium text-xs text-gray-500  ">
        {types}
      </h2>
    </div>
  );
};

export default UserCards;
