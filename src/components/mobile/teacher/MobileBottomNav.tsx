"use client";

import {
  Bell,
  ClipboardCheck,
  LayoutGrid,
  Users,
} from "lucide-react";

function BottomNavItem({
  icon,
  active = false,
}: any) {
  return (
    <button
      className={`
        w-10
        h-10
        rounded-[20px]
        flex
        items-center
        justify-center
        transition-all
        ${
          active
            ? "bg-gradient-to-br from-[#7267F6] to-[#8E7BFF] text-white shadow-lg shadow-indigo-500/30"
            : "text-slate-400"
        }
      `}
    >
      {icon}
    </button>
  );
}

export default function MobileBottomNav() {
  return (
    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        w-[92%]
        bg-white/90
        backdrop-blur-xl
        border border-white/30
        rounded-[30px]
        px-6
        py-2
        shadow-[0_10px_40px_rgba(0,0,0,0.10)]
        z-50
      "
    >
      <div className="flex items-center justify-between">
        <BottomNavItem
          icon={<LayoutGrid size={22} />}
          active
        />

        <BottomNavItem icon={<Users size={22} />} />

        <BottomNavItem
          icon={<ClipboardCheck size={22} />}
        />

        <BottomNavItem icon={<Bell size={22} />} />
      </div>
    </div>
  );
}