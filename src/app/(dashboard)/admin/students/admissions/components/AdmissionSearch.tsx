"use client";

import { Search, X } from "lucide-react";

interface AdmissionSearchProps {
  search: string;
  onSearchChange: (value: string) => void;

  classFilter: string;
  onClassChange: (value: string) => void;

  classes: {
    id: number;
    name: string;
  }[];
}

export default function AdmissionSearch({
  search,
  onSearchChange,
  classFilter,
  onClassChange,
  classes,
}: AdmissionSearchProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Search */}

        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student, parent, phone or roll number..."
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Class Filter */}

        <select
          value={classFilter}
          onChange={(e) => onClassChange(e.target.value)}
          className="h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="">All Classes</option>

          {classes.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}