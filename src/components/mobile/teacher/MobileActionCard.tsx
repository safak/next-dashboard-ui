"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  icon: ReactNode;
  bg?: string;
  iconBg?: string;
  iconColor?: string;
  onClick: () => void;
};

export default function MobileActionCard({
  title,
  icon,
  bg = "bg-white",
  iconBg = "bg-[#E7ECF8]",
  iconColor = "text-[#4B517D]",
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        flex
        min-h-[108px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-[20px]
        border
        border-slate-100
        ${bg}
        px-2
        py-3
        shadow-[0_4px_14px_rgba(15,23,42,0.06)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_7px_20px_rgba(15,23,42,0.09)]
        active:scale-[0.97]
      `}
    >
      <div
        className={`
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-[16px]
          ${iconBg}
          ${iconColor}
          shadow-sm
          ring-1
          ring-black/[0.02]
          transition-transform
          duration-200
          group-hover:scale-105
        `}
      >
        <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
      </div>

      <span
        className="
          mt-3
          line-clamp-2
          min-h-[28px]
          max-w-[92px]
          text-center
          text-[10px]
          font-semibold
          leading-[14px]
          text-slate-800
        "
      >
        {title}
      </span>

      <span
        className="
          absolute
          bottom-2
          h-0.5
          w-0
          rounded-full
          bg-[#F59A23]
          transition-all
          duration-200
          group-hover:w-5
        "
      />
    </button>
  );
}
