"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export default function ActionCard({
  title,
  description,
  href,
  icon,
  color,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="
      group
      rounded-2xl
      border
      bg-white
      p-6
      shadow-sm
      transition-all
      hover:-translate-y-1
      hover:border-sky-300
      hover:shadow-lg
    "
    >
      <div
        className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-6 flex items-center font-medium text-sky-600">
        Open

        <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}