"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type FilterOption = { value: string | number; label: string };
export type FilterDef = { key: string; label: string; options: FilterOption[] };
export type SortDef = { value: string; label: string };

// Filter + sort buttons for list pages. State lives in the URL
// (?classId=1&sort=name-asc) so the server page does the actual querying.
const ListControls = ({
  filters = [],
  sorts = [],
}: {
  filters?: FilterDef[];
  sorts?: SortDef[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState<"filter" | "sort" | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const update = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // results changed, start from page 1
    router.push(`${pathname}?${params}`);
  };

  const activeFilters = filters.filter((f) => searchParams.get(f.key)).length;
  const currentSort = searchParams.get("sort") ?? "";

  const iconButton =
    "relative w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow transition hover:brightness-95 hover:shadow-sm";
  const panel =
    "absolute right-0 top-10 z-40 w-64 rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-100 flex flex-col gap-3";

  return (
    <div className="relative flex items-center gap-4" ref={ref}>
      {filters.length > 0 && (
        <button
          type="button"
          title="Filter"
          aria-expanded={open === "filter"}
          className={iconButton}
          onClick={() => setOpen(open === "filter" ? null : "filter")}
        >
          <Image src="/filter.png" alt="" width={14} height={14} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] text-white flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      )}
      {sorts.length > 0 && (
        <button
          type="button"
          title="Sort"
          aria-expanded={open === "sort"}
          className={iconButton}
          onClick={() => setOpen(open === "sort" ? null : "sort")}
        >
          <Image src="/sort.png" alt="" width={14} height={14} />
          {currentSort && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
          )}
        </button>
      )}

      {open === "filter" && (
        <div className={panel}>
          <span className="text-sm font-semibold text-gray-700">Filter</span>
          {filters.map((f) => (
            <label key={f.key} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">{f.label}</span>
              <select
                className="form-control"
                value={searchParams.get(f.key) ?? ""}
                onChange={(e) => update({ [f.key]: e.target.value || null })}
              >
                <option value="">All</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {activeFilters > 0 && (
            <button
              type="button"
              className="self-start text-xs font-medium text-indigo-500 hover:underline"
              onClick={() =>
                update(Object.fromEntries(filters.map((f) => [f.key, null])))
              }
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {open === "sort" && (
        <div className={panel}>
          <span className="text-sm font-semibold text-gray-700">Sort by</span>
          <div className="flex flex-col">
            {[{ value: "", label: "Default" }, ...sorts].map((s) => (
              <button
                key={s.value}
                type="button"
                className={`text-left text-sm px-2 py-1.5 rounded-lg transition ${
                  currentSort === s.value
                    ? "bg-lamaSkyLight font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => {
                  update({ sort: s.value || null });
                  setOpen(null);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListControls;
