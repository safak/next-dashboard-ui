"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import {
  CalendarDays,
  FileCheck2,
  GraduationCap,
  IndianRupee,
  SlidersHorizontal,
} from "lucide-react";

interface AdmissionOption {
  value: string;
  label: string;
}

interface AdmissionFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  academicYearFilter: string;
  onAcademicYearFilterChange: (value: string) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;

  feeStatusFilter: string;
  onFeeStatusFilterChange: (value: string) => void;

  documentFilter: string;
  onDocumentFilterChange: (value: string) => void;

  academicYearOptions: AdmissionOption[];
  classOptions: AdmissionOption[];
}

export default function AdmissionFiltersDrawer({
  open,
  onOpenChange,

  academicYearFilter,
  onAcademicYearFilterChange,

  classFilter,
  onClassFilterChange,

  statusFilter,
  onStatusFilterChange,

  feeStatusFilter,
  onFeeStatusFilterChange,

  documentFilter,
  onDocumentFilterChange,

  academicYearOptions,
  classOptions,
}: AdmissionFiltersDrawerProps) {
  const reset = () => {
    onAcademicYearFilterChange("all");
    onClassFilterChange("all");
    onStatusFilterChange("all");
    onFeeStatusFilterChange("all");
    onDocumentFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Admission Filters"
      description="Narrow down the admission list using the filters below."
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
            <CalendarDays className="h-4 w-4 text-indigo-500" />

            <span>Academic Year</span>
          </label>

          <RadixSelect
            value={academicYearFilter}
            onChange={onAcademicYearFilterChange}
            placeholder="All Academic Years"
            options={[
              {
                value: "all",
                label: "All Academic Years",
              },
              ...academicYearOptions,
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <GraduationCap className="h-4 w-4 text-blue-500" />

            <span>Class</span>
          </label>

          <RadixSelect
            value={classFilter}
            onChange={onClassFilterChange}
            placeholder="All Classes"
            options={[
              {
                value: "all",
                label: "All Classes",
              },
              ...classOptions,
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-violet-500" />

            <span>Student Status</span>
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
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
              {
                value: "GRADUATED",
                label: "Graduated",
              },
              {
                value: "TRANSFERRED",
                label: "Transferred",
              },
              {
                value: "ARCHIVED",
                label: "Archived",
              },
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <IndianRupee className="h-4 w-4 text-amber-500" />

            <span>Fee Status</span>
          </label>

          <RadixSelect
            value={feeStatusFilter}
            onChange={onFeeStatusFilterChange}
            placeholder="All Fee Statuses"
            options={[
              {
                value: "all",
                label: "All Fee Statuses",
              },
              {
                value: "PAID",
                label: "Paid",
              },
              {
                value: "PARTIAL",
                label: "Partially Paid",
              },
              {
                value: "PENDING",
                label: "Pending",
              },
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileCheck2 className="h-4 w-4 text-emerald-500" />

            <span>Documents</span>
          </label>

          <RadixSelect
            value={documentFilter}
            onChange={onDocumentFilterChange}
            placeholder="All Documents"
            options={[
              {
                value: "all",
                label: "All Documents",
              },
              {
                value: "complete",
                label: "Documents Complete",
              },
              {
                value: "pending",
                label: "Documents Pending",
              },
            ]}
          />
        </div>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Combine
            multiple filters to quickly find the admissions you need.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
