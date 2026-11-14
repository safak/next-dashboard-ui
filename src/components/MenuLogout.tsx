"use client";

import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

const MenuLogout = () => {
  return (
    <SignOutButton>
      <button
        type="button"
        className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight w-full"
      >
        <Image src="/logout.png" alt="" width={20} height={20} />
        <span className="hidden lg:block">Logout</span>
      </button>
    </SignOutButton>
  );
};

export default MenuLogout;
