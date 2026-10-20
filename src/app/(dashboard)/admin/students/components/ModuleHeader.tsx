"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface ModuleHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  icon?: LucideIcon;
  image?: string;
  imageClassName?: string;
}

export default function ModuleHeader({
  title,
  description,
  action,
  breadcrumbs = [],
  icon: Icon,
  image,
  imageClassName,
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* --------------------------------------------------
          Left: Header Content
      -------------------------------------------------- */}

      <div className="min-w-0">
        {/* Breadcrumbs */}

        {breadcrumbs.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center gap-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-1 h-4 w-4 text-slate-400" />
                )}

                {item.href ? (
                  <Link
                    href={item.href}
                    className="font-medium text-slate-500 transition-colors hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-900">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --------------------------------------------------
            Title + Icon / Image
        -------------------------------------------------- */}

        <div className="flex items-start gap-3">
          {/* Custom Image */}
          {image ? (
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center">
              <Image
                src={image}
                alt=""
                width={44}
                height={44}
                className={imageClassName ?? "h-10 w-10 object-contain"}
              />
            </div>
          ) : Icon ? (
            /* Lucide Icon */
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.8} />
            </div>
          ) : null}

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            <p className="mt-0.5 text-sm text-slate-600">{description}</p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          Right: Action
      -------------------------------------------------- */}

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
