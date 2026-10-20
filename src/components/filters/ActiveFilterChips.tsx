"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, Filter, Plus } from "lucide-react";

/* ================= TYPES ================= */

type Option = { label: string; value: string };

type FilterConfig = {
  [key: string]: {
    label: string;
    icon?: string;
    options?: Option[];
  };
};

type Props = {
  config: FilterConfig;
};

/* ================= COMPONENT ================= */

export default function AdvancedFilterBar({ config }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenKey(null);
        setAddOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= UPDATE QUERY ================= */

  const updateQuery = (key: string, value?: string) => {
    const query = new URLSearchParams(params.toString());

    if (value) query.set(key, value);
    else query.delete(key);

    query.delete("page"); // reset pagination

    router.push(`?${query.toString()}`);
  };

  const clearAll = () => router.push("?");

  /* ================= ACTIVE FILTERS ================= */

  const activeFilters: { key: string; value: string }[] = [];

  params.forEach((value, key) => {
    if (config[key]) {
      activeFilters.push({ key, value });
    }
  });

  if (activeFilters.length === 0) return null;

  /* ================= UI ================= */

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-2 mb-3">
      {/* LABEL */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Filter size={14} />
        Filters
        <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px]">
          {activeFilters.length}
        </span>
      </div>

      {/* ACTIVE CHIPS */}
      {activeFilters.map(({ key, value }) => {
        const conf = config[key];
        const options = conf.options || [];

        const selected = options.find((o) => o.value === value);

        return (
          <div key={key} className="relative">
            <div
              onClick={() => setOpenKey(openKey === key ? null : key)}
              className={`cursor-pointer flex items-center gap-2 px-3 py-1 rounded-full text-xs transition
                ${
                  openKey === key
                    ? "bg-purple-200 text-purple-900"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
            >
              <span>{conf.icon || "🔹"}</span>

              <span className="font-medium">
                {conf.label}: {selected?.label || value}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuery(key);
                }}
                className="hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>

            {/* EDIT DROPDOWN */}
            {openKey === key && options.length > 0 && (
              <div className="absolute z-20 mt-1 bg-white border rounded-lg shadow-md w-44 overflow-hidden">
                {/* CHANGE OPTIONS */}
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      updateQuery(key, opt.value);
                      setOpenKey(null);
                    }}
                    className="px-3 py-2 text-xs hover:bg-purple-50 cursor-pointer"
                  >
                    {opt.label}
                  </div>
                ))}

                {/* CLEAR FILTER */}
                <div
                  onClick={() => {
                    updateQuery(key);
                    setOpenKey(null);
                  }}
                  className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 cursor-pointer border-t"
                >
                  Clear filter
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ADD FILTER */}
      <div className="relative">
        {(() => {
          const availableFilters = Object.entries(config).filter(
            ([key]) => !params.has(key),
          );

          return (
            <>
              <button
                onClick={() => setAddOpen(!addOpen)}
                disabled={availableFilters.length === 0}
                className={`flex items-center gap-1 px-2 py-1 text-xs border rounded-full
            ${
              availableFilters.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50"
            }`}
              >
                <Plus size={12} /> Filter
              </button>

              {addOpen && (
                <div className="absolute z-20 mt-1 bg-white border rounded-lg shadow-md w-52 max-h-64 overflow-auto">
                  {availableFilters.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-gray-500 text-center">
                      No filters available
                    </div>
                  ) : (
                    availableFilters.map(([key, conf]) => (
                      <div key={key} className="border-b last:border-none">
                        <div className="px-3 py-2 text-xs font-medium text-gray-600">
                          {conf.icon} {conf.label}
                        </div>

                        {conf.options && conf.options.length > 0 ? (
                          conf.options.map((opt) => (
                            <div
                              key={opt.value}
                              onClick={() => {
                                updateQuery(key, opt.value);
                                setAddOpen(false);
                              }}
                              className="px-3 py-2 text-xs hover:bg-purple-50 cursor-pointer"
                            >
                              {opt.label}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-gray-400">
                            No options
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* CLEAR ALL */}
      {activeFilters.length > 1 && (
        <button
          onClick={clearAll}
          className="ml-2 text-xs text-gray-500 hover:text-red-500 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
