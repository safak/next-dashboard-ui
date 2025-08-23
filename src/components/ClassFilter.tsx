// components/ClassFilter.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClassType = {
  id: number;
  name: string;
};

type Props = {
  classId: string;
  classes: ClassType[];
};

export default function ClassFilter({ classId, classes }: Props) {
  const handleChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set("classId", value);
    else params.delete("classId");
    window.location.search = params.toString();
  };

  return (
    <div className="w-64">
      <Select value={classId} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Toutes les classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les classes</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
