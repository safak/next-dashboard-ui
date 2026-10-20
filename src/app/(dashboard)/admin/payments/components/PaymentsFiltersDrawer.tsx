"use client";

import { CreditCard, SlidersHorizontal } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

interface PaymentsFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  modeFilter: string;
  onModeFilterChange: (value: string) => void;
}

export default function PaymentsFiltersDrawer({
  open,
  onOpenChange,
  modeFilter,
  onModeFilterChange,
}: PaymentsFiltersDrawerProps) {
  const reset = () => {
    onModeFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Payment Filters"
      description="Narrow down the payment list using the filters below."
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
            <CreditCard className="h-4 w-4 text-violet-500" />
            Payment Mode
          </label>

          <RadixSelect
            value={modeFilter}
            onChange={onModeFilterChange}
            placeholder="All Payment Modes"
            options={[
              {
                value: "all",
                label: "All Payment Modes",
              },
              {
                value: "CASH",
                label: "Cash",
              },
              {
                value: "UPI",
                label: "UPI",
              },
              {
                value: "CARD",
                label: "Card",
              },
              {
                value: "BANK_TRANSFER",
                label: "Bank Transfer",
              },
            ]}
          />
        </div>
      </div>
    </Drawer>
  );
}
