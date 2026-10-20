"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
};

export default function SettingsItem({
  icon,
  label,
  description,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-5
                 hover:bg-gray-50 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        {/* ICON PILL */}
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600
                        flex items-center justify-center">
          {icon}
        </div>

        {/* TEXT */}
        <div>
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>

      {/* CHEVRON */}
      <ChevronRight
        size={18}
        className="text-gray-300 group-hover:text-gray-500
                   group-hover:translate-x-1 transition"
      />
    </Link>
  );
}
