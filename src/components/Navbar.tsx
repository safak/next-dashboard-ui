import ClientUserButton from "@/components/ClientUserButton";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
  const user = await currentUser();
  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "User";

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      <div className="flex items-center gap-6 justify-end w-full">
        <Link
          href="/list/messages"
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center"
        >
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </Link>
        <Link
          href="/list/announcements"
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center relative"
        >
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </Link>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{displayName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata?.role as string}
          </span>
        </div>
        <ClientUserButton />
      </div>
    </div>
  );
};

export default Navbar;
