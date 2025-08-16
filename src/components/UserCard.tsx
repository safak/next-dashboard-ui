import Image from "next/image";
import { getImagePath } from "@/lib/utils";

export type TUserCard = {
  date: string;
  counter: string | number;
  category: string;
};

const UserCard = ({
  date = "2024/25",
  counter = "6,123",
  category = "students",
}: TUserCard) => {
  return (
    <div
      className={
        "flex flex-col odd:bg-lamaPurple even:bg-lamaYellow flex-1 p-3 rounded-2xl min-w-[120px]"
      }
    >
      {/* header */}
      <div className="flex flex-row justify-between items-center">
        <span className="text-[10px] text-green-600 bg-white px-2 py-1 rounded-full">
          {date}
        </span>
        <Image
          src={getImagePath("/more.png")}
          alt="menu options"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
      <h1 className="text-2xl font-bold my-4">{counter}</h1>
      <div className="capitalize text-xs md:text-sm text-gray-600 font-medium">
        {category}
      </div>
    </div>
  );
};

export default UserCard;
