"use client";

import { LucideIcon } from "lucide-react";

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export default function ReadOnlyField({
  label,
  value,
  icon: Icon,
}: ReadOnlyFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex h-11 w-full items-center rounded-xl border border-slate-300 bg-slate-50 px-3 transition-colors">
        {Icon && (
          <Icon className="mr-2 h-4 w-4 text-slate-500" />
        )}

        <span className="text-sm font-medium text-slate-700">
          {value}
        </span>
      </div>
    </div>
  );
}