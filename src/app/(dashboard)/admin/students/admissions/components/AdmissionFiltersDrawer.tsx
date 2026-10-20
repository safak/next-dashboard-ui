"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import { SlidersHorizontal } from "lucide-react";

interface AdmissionFilters {
  status: string;
  classId: string;
  academicYear: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  filters: AdmissionFilters;

  onFiltersChange: (filters: AdmissionFilters) => void;

  classes: {
    id: number;
    name: string;
  }[];

  academicYears: string[];
}

export default function AdmissionFiltersDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  classes,
  academicYears,
}: Props) {
  const update = (
    key: keyof AdmissionFilters,
    value?: string,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value ?? "all",
    });
  };

  const reset = () => {
    onFiltersChange({
      status: "all",
      classId: "all",
      academicYear: "all",
    });
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="md"
      title="Admission Filters"
      description="Filter admission records using different criteria."
      icon={<SlidersHorizontal className="h-5 w-5" />}
      footer={
        <>
          <Button
            variant="outline"
            onClick={reset}
          >
            Reset
          </Button>

          <Button onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Status */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <RadixSelect
            value={filters.status}
            onChange={(value) => update("status", value)}
            placeholder="All Status"
            options={[
              {
                value: "all",
                label: "All Status",
              },
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
            ]}
          />
        </div>

        {/* Class */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Class
          </label>

          <RadixSelect
            value={filters.classId}
            onChange={(value) => update("classId", value)}
            placeholder="All Classes"
            options={[
              {
                value: "all",
                label: "All Classes",
              },
              ...classes.map((c) => ({
                value: String(c.id),
                label: c.name,
              })),
            ]}
          />
        </div>

        {/* Academic Year */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Academic Year
          </label>

          <RadixSelect
            value={filters.academicYear}
            onChange={(value) =>
              update("academicYear", value)
            }
            placeholder="All Academic Years"
            options={[
              {
                value: "all",
                label: "All Academic Years",
              },
              ...academicYears.map((year) => ({
                value: year,
                label: year,
              })),
            ]}
          />
        </div>
      </div>
    </Drawer>
  );
}