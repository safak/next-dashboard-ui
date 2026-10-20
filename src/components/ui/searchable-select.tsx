"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value?: string;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

export default function SearchableSelect({
  value,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled,
  className,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");

  const selected = options.find(
    (o) => o.value === value,
  );

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-between rounded-xl",
            className,
          )}
        >
          {selected?.label ?? placeholder}

          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-2"
        align="start"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <input
            autoFocus
            type="text"
            value={search}
            placeholder={searchPlaceholder}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="mb-2 h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-500">
              {emptyMessage}
            </div>
          )}

          {filtered.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                setSearch("");
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              <span>{option.label}</span>

              {value === option.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}