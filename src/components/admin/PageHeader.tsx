"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { LucideIcon, Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;

  icon?: LucideIcon;
  image?: string;

  iconClassName?: string;
  iconBackgroundClassName?: string;
  imageClassName?: string;
}

export default function PageHeader({
  title,
  subtitle,
  children,
  icon: Icon = Sparkles,
  image,
  iconClassName = "text-indigo-600",
  iconBackgroundClassName = "bg-indigo-50",
  imageClassName = "h-9 w-9",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconBackgroundClassName}
          `}
        >
          {image ? (
            <Image
              src={image}
              alt=""
              width={44}
              height={44}
              className={`object-contain ${imageClassName}`}
            />
          ) : (
            <Icon className={`h-5 w-5 ${iconClassName}`} />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-0.5 text-sm leading-5 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}