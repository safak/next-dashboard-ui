"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type YearFilterProps = {
  years: { id: number; label: string }[];
  selectedYearId?: number;
};

export default function YearFilter({ years, selectedYearId }: YearFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (val) {
      params.set("yearId", val);
    } else {
      params.delete("yearId");
    }

    // Reset page à 1 quand on change l'année
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-4 w-64">
      <label htmlFor="yearId" className="block mb-1 font-semibold">
        Année scolaire
      </label>
      <select
        id="yearId"
        name="yearId"
        value={selectedYearId ? selectedYearId.toString() : ""}
        className="border rounded px-2 py-1 w-full"
        onChange={handleChange}
      >
        <option value="">-- Toutes les années --</option>
        {years.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
