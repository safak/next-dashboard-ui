"use client";

import { Search } from "lucide-react";
import { ReactNode } from "react";

interface SearchToolbarProps {
  search: string;
  onSearch: (value: string) => void;

  placeholder?: string;

  leftContent?: ReactNode;
  rightContent?: ReactNode;

  className?: string;
}

export default function SearchToolbar({
  search,
  onSearch,
  placeholder,
  leftContent,
  rightContent,
  className = "",
}: SearchToolbarProps) {
  return (
    <div className={`flex flex-col gap-4 rounded-xl border p-4 shadow-sm md:flex-row md:items-center md:justify-between ${className}`}>
      {/* Left Section */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {leftContent}
      </div>

      {/* Right Section */}
      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </div>
  );
}