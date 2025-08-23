"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 md:px-2 py-2 rounded-md hover:bg-kalasaSkyLight"
      type="button"
    >
      <Image src="/uploads/logout.png" alt="Logout" width={20} height={20} />
      <span className="hidden lg:block">Logout</span>
    </button>
  );
}
