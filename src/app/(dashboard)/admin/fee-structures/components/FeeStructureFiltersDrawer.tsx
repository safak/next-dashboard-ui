"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";
import { SlidersHorizontal, CheckCircle2, XCircle } from "lucide-react";

interface FeeStructureFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function FeeStructureFiltersDrawer({
  open,
  onOpenChange,
  statusFilter,
  onStatusFilterChange,
}: FeeStructureFiltersDrawerProps) {
  const reset = () => {
    onStatusFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Fee Structure Filters"
      description="Narrow down the fee structure list using the filters below."
      icon={<SlidersHorizontal className="h-4 w-4" />}
      footer={
        <>
          <Button type="button" variant="outline" onClick={reset}>
            Reset
          </Button>

          <Button type="button" onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />

            <span>Status</span>
          </label>

          <RadixSelect
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="All Statuses"
            options={[
              {
                value: "all",
                label: "All Statuses",
              },
              {
                value: "active",
                label: "Active",
              },
              {
                value: "inactive",
                label: "Inactive",
              },
            ]}
          />
        </div>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Use the
            status filter to quickly view active or inactive fee structures.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
