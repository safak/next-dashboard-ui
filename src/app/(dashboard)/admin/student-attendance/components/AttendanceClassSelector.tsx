"use client";

import RadixSelect from "@/components/ui/RadixSelect";

interface AttendanceClassSelectorProps {
  value: string;

  options: {
    value: string;
    label: string;
  }[];

  onChange: (value: string) => void;

  disabled?: boolean;

  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export default function AttendanceClassSelector({
  value,
  options,
  onChange,
  disabled = false,
  open,
  onOpenChange,
}: AttendanceClassSelectorProps) {
  return (
    <div className="w-full sm:w-[245px]">
      <RadixSelect
        value={value}
        onChange={onChange}
        placeholder="Select a class"
        options={options}
        emptyTitle="No Classes Available"
        emptyDescription="Create a class before managing attendance."
        disabled={disabled}
        open={open}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}