import Image from "next/image";

const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl odd:bg-sensPurple even:bg-sensYellow p-4 flex-1 md:flex-col min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          6/9/2024
        </span>
        <Image
          src="/more.png"
          alt=""
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
      <h1 className="text-2xl font-semibold my-4">1,233</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
