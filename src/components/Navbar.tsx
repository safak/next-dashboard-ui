import prisma from "@/lib/prisma";
import { classScopedWhere } from "@/lib/visibility";
import { auth, getDisplayName } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const CountBadge = ({ count, label }: { count: number; label: string }) =>
  count > 0 ? (
    <span
      title={label}
      className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 ring-2 ring-[#F7F8FA] flex items-center justify-center bg-purple-500 text-white rounded-full text-[10px] font-medium"
    >
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

const Navbar = async () => {
  const [{ userId, role }, displayName] = await Promise.all([
    auth(),
    getDisplayName(),
  ]);

  const [unreadMessages, newAnnouncements] = userId
    ? await Promise.all([
        prisma.message.count({ where: { receiverId: userId, read: false } }),
        prisma.announcement.count({
          where: {
            ...classScopedWhere(role, userId),
            date: { gte: new Date(Date.now() - WEEK_MS), lte: new Date() },
          },
        }),
      ])
    : [0, 0];

  return (
    <div className="flex items-center justify-between p-4">
      <form
        action="/search"
        role="search"
        className="hidden md:flex items-center gap-2 text-xs rounded-full bg-white ring-1 ring-gray-200 px-3 transition focus-within:ring-2 focus-within:ring-lamaPurple"
      >
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="search"
          name="q"
          aria-label="Search the school"
          placeholder="Search people, classes, events..."
          className="w-[240px] p-2 bg-transparent outline-none"
        />
      </form>
      <div className="flex items-center gap-6 justify-end w-full">
        <Link
          href="/list/messages"
          title="Messages"
          className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm transition hover:bg-gray-50 relative"
        >
          <Image src="/message.png" alt="Messages" width={20} height={20} />
          <CountBadge count={unreadMessages} label="Unread messages" />
        </Link>
        <Link
          href="/list/announcements"
          title="Announcements"
          className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm transition hover:bg-gray-50 relative"
        >
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <CountBadge
            count={newAnnouncements}
            label="Announcements in the last 7 days"
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{displayName}</span>
          <span className="text-[10px] text-gray-500 text-right capitalize">
            {role}
          </span>
        </div>
        <Link
          href="/profile"
          title="Profile"
          className="w-9 h-9 rounded-full bg-lamaPurple flex items-center justify-center text-sm font-semibold text-gray-700 transition hover:ring-2 hover:ring-indigo-200"
        >
          {displayName.charAt(0).toUpperCase()}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
