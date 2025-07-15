"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type Option = {
  id: string;
  name: string;
};

interface MultiSelectWithSelectStyleProps {
  label: string;
  param: string;
  options: Option[];
}

export function MultiSelectWithSelectStyle({
  label,
  param,
  options,
}: MultiSelectWithSelectStyleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const selectedValues = React.useMemo(
    () => new Set(searchParams.get(param)?.split(",") ?? []),
    [searchParams, param]
  );

  const handleToggle = (id: string) => {
    const updated = new Set(selectedValues);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }

    const newParams = new URLSearchParams(searchParams.toString());

    if (updated.size > 0) {
      newParams.set(param, Array.from(updated).join(","));
    } else {
      newParams.delete(param);
    }
    newParams.delete("page"); // reset pagination on filter

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            role="combobox"
          >
            {selectedValues.size > 0
              ? `${selectedValues.size} sélectionné(s)`
              : `Choisir ${label.toLowerCase()}`}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[200px] p-1 space-y-1">
          {options.map((option) => {
            const isSelected = selectedValues.has(option.id);
            return (
              <div
                key={option.id}
                onClick={() => handleToggle(option.id)}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted",
                  isSelected ? "bg-muted font-medium" : ""
                )}
              >
                <span>{option.name}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
