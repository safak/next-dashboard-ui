"use client";

import * as React from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option<T extends string> = {
  value: T;
  label: string;
};

type ComboboxFieldProps<T extends string> = {
  label?: string;
  name: string;
  datas: Option<T>[];
  value: T | T[];
  error?: FieldError;
  placeholder?: string;
  setValue: UseFormSetValue<any>;
  multiple?: boolean; // 👈 Nouveau
};

export default function ComboboxField<T extends string>({
  label,
  name,
  datas,
  value,
  error,
  placeholder,
  setValue,
  multiple = false,
}: ComboboxFieldProps<T>) {
  const [open, setOpen] = React.useState(false);

  if (multiple) {
    const selected = Array.isArray(value) ? value : [];

    const toggleValue = (val: T) => {
      if (selected.includes(val)) {
        setValue(
          name,
          selected.filter((v) => v !== val)
        );
      } else {
        setValue(name, [...selected, val]);
      }
    };

    const displayValue =
      selected.length > 0
        ? datas
            .filter((d) => selected.includes(d.value))
            .map((d) => d.label)
            .join(", ")
        : placeholder || `Select ${label}`;

    return (
      <div className="w-full">{/* 
        {label && <label className="text-xs text-gray-500 mb-1 block">{label}</label>} */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {displayValue}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandGroup>
                {datas.map((data) => (
                  <CommandItem
                    key={data.value}
                    onSelect={() => toggleValue(data.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(data.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {data.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {error?.message && (
          <p className="text-xs text-red-400 mt-1">{error.message}</p>
        )}
      </div>
    );
  }

  // Single select mode
  return (
    <div className="w-full">
      <Select
        value={value as T}
        onValueChange={(val) => setValue(name, val as T)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {datas.map((data) => (
              <SelectItem value={data.value} key={data.value}>
                {data.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error?.message && (
        <p className="text-xs text-red-400 mt-1">{error.message}</p>
      )}
    </div>
  );
}
