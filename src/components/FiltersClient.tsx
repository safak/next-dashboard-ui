"use client";

import React from "react";
import { MultiSelectWithSelectStyle } from "./MultiSelectWithSelectStyle";

interface FiltersClientProps {
  semesters: { id: string; name: string; label?: string }[];
}

export function FiltersClient({ semesters }: FiltersClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <MultiSelectWithSelectStyle
        label="Semestre"
        param="semesterId"
        options={semesters.map((s) => ({
          id: s.id,
          name: s.label || s.name,
        }))}
      />
    </div>
  );
}
