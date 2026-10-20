"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;

  /**
   * Makes the section content span the complete width.
   * Useful when the section contains its own grid/layout.
   */
  fullWidth?: boolean;
}

export default function FormSection({
  title,
  description,
  children,
  className,
  fullWidth = false,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4",
        className,
      )}
    >
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <div
        className={cn(
          "w-full min-w-0",
          !fullWidth && "grid grid-cols-1 gap-6 md:grid-cols-2",
        )}
      >
        {children}
      </div>
    </section>
  );
}