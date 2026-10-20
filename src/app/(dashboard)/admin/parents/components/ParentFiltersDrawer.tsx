"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import { Mail, Phone, SlidersHorizontal, Users } from "lucide-react";

interface ParentFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  studentFilter: string;
  onStudentFilterChange: (value: string) => void;

  studentCountFilter: string;
  onStudentCountFilterChange: (value: string) => void;

  contactFilter: string;
  onContactFilterChange: (value: string) => void;
}

export default function ParentFiltersDrawer({
  open,
  onOpenChange,

  studentFilter,
  onStudentFilterChange,

  studentCountFilter,
  onStudentCountFilterChange,

  contactFilter,
  onContactFilterChange,
}: ParentFiltersDrawerProps) {
  const reset = () => {
    onStudentFilterChange("all");
    onStudentCountFilterChange("all");
    onContactFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Parent Filters"
      description="Narrow down the parent list using the filters below."
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
        {/* Student Relationship */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4 text-blue-500" />

            <span>Students</span>
          </label>

          <RadixSelect
            value={studentFilter}
            onChange={onStudentFilterChange}
            placeholder="All Parents"
            options={[
              {
                value: "all",
                label: "All Parents",
              },
              {
                value: "no-students",
                label: "No Students",
              },
              {
                value: "has-students",
                label: "Has Students",
              },
            ]}
          />
        </div>

        {/* Student Count */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4 text-violet-500" />

            <span>Student Count</span>
          </label>

          <RadixSelect
            value={studentCountFilter}
            onChange={onStudentCountFilterChange}
            placeholder="Any Number"
            options={[
              {
                value: "all",
                label: "Any Number",
              },
              {
                value: "one",
                label: "1 Student",
              },
              {
                value: "multiple",
                label: "2+ Students",
              },
            ]}
          />
        </div>

        {/* Contact Information */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />

            <span>Contact Information</span>
          </label>

          <RadixSelect
            value={contactFilter}
            onChange={onContactFilterChange}
            placeholder="All Contact Details"
            options={[
              {
                value: "all",
                label: "All Contact Details",
              },
              {
                value: "email",
                label: "Email Available",
              },
              {
                value: "phone",
                label: "Phone Available",
              },
              {
                value: "both",
                label: "Email & Phone Available",
              },
            ]}
          />
        </div>

        {/* Information */}

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Combine
            multiple filters to quickly find the parents you need.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
