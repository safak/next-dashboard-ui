"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";
import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  GraduationCap,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FeeFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  academicYearFilter: string;
  onAcademicYearFilterChange: (value: string) => void;

  studentFilter: string;
  onStudentFilterChange: (value: string) => void;

  installmentFilter: string;
  onInstallmentFilterChange: (value: string) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;

  feeStructureFilter: string;
  onFeeStructureFilterChange: (value: string) => void;

  classOptions: FilterOption[];
  academicYearOptions: FilterOption[];
  studentOptions: FilterOption[];
  feeStructureOptions: FilterOption[];
}

export default function FeeFiltersDrawer({
  open,
  onOpenChange,

  classFilter,
  onClassFilterChange,

  academicYearFilter,
  onAcademicYearFilterChange,

  studentFilter,
  onStudentFilterChange,

  installmentFilter,
  onInstallmentFilterChange,

  statusFilter,
  onStatusFilterChange,

  feeStructureFilter,
  onFeeStructureFilterChange,

  classOptions,
  academicYearOptions,
  studentOptions,
  feeStructureOptions,
}: FeeFiltersDrawerProps) {
  const reset = () => {
    onClassFilterChange("all");
    onAcademicYearFilterChange("all");
    onStudentFilterChange("all");
    onInstallmentFilterChange("all");
    onStatusFilterChange("all");
    onFeeStructureFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Fee Filters"
      description="Narrow down the fee list using the filters below."
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
        {/* --------------------------------------------------
            Class
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <GraduationCap className="h-4 w-4 text-violet-500" />

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

        {/* --------------------------------------------------
            Academic Year
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays className="h-4 w-4 text-blue-500" />

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

        {/* --------------------------------------------------
            Student
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4 text-emerald-500" />

            <span>Student</span>
          </label>

          <RadixSelect
            value={studentFilter}
            onChange={onStudentFilterChange}
            placeholder="All Students"
            options={[
              {
                value: "all",
                label: "All Students",
              },
              ...studentOptions,
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Fee Structure
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4 text-indigo-500" />

            <span>Fee Structure</span>
          </label>

          <RadixSelect
            value={feeStructureFilter}
            onChange={onFeeStructureFilterChange}
            placeholder="All Fee Structures"
            options={[
              {
                value: "all",
                label: "All Fee Structures",
              },
              ...feeStructureOptions,
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Installment
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <CircleDollarSign className="h-4 w-4 text-amber-500" />

            <span>Installment</span>
          </label>

          <RadixSelect
            value={installmentFilter}
            onChange={onInstallmentFilterChange}
            placeholder="All Installments"
            options={[
              {
                value: "all",
                label: "All Installments",
              },
              {
                value: "ADMISSION",
                label: "Admission Fee",
              },
              {
                value: "TERM_1",
                label: "Term 1",
              },
              {
                value: "TERM_2",
                label: "Term 2",
              },
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Payment Status
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-rose-500" />

            <span>Payment Status</span>
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
                value: "PENDING",
                label: "Pending",
              },
              {
                value: "PARTIAL",
                label: "Partial",
              },
              {
                value: "PAID",
                label: "Paid",
              },
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Information
        -------------------------------------------------- */}

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span>{" "}
            Combine multiple filters to quickly find specific students,
            installments, or payment statuses.
          </p>
        </div>
      </div>
    </Drawer>
  );
}