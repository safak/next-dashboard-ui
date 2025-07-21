'use client';

import Image from "next/image";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Invité";
  const role = session?.user?.roles?.[0]?.name ?? "guest";

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH Bar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/uploads/search.png" alt="search" width={14} height={14} />
        <input
          type="text"
          placeholder="search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/uploads/message.png" alt="message" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/uploads/announcement.png" alt="notif" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{name}</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>
        <Image
          src="/uploads/avatar.png"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
