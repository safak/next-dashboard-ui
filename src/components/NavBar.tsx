import Image from "next/image";
import { getImagePath } from "@/lib/utils";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* seatch bar */}
      <div className="hidden md:flex items-center gap-2 rounded-full text-xs ring-[1.5px] ring-gray-300 px-2">
        <Image
          src={getImagePath("/search.png")}
          alt="search icon"
          width={14}
          height={14}
        />
        <input
          type="text"
          placeholder={"search..."}
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* icons and user */}
      <div className="flex gap-6 items-center justify-end w-full">
        <div className="bg-white w-7 h-7 justify-center flex items-center rounded-full cursor-pointer">
          <Image
            src={getImagePath("/message.png")}
            alt="message icon"
            width={20}
            height={20}
          />
        </div>
        <div className="bg-white w-7 h-7 flex justify-center items-center rounded-full cursor-pointer relative">
          <Image
            src={getImagePath("/announcement.png")}
            alt="announcement icon"
            width={20}
            height={20}
          />
          <div className="absolute -top-3 -right-3 flex items-center justify-center bg-violet-500 text-white rounded-full w-4 h-4 text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image
          src={getImagePath("/avatar.png")}
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default NavBar;
