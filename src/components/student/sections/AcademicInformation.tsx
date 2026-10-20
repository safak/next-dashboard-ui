"use client";

import { GraduationCap } from "lucide-react";
import { useFormContext } from "react-hook-form";

import RadixSelect from "@/components/ui/RadixSelect";
import { StudentFormValues } from "@/lib/formValidationSchemas";

interface AcademicInformationProps {
  classes: {
    id: number;
    name: string;
  }[];

  parents?: {
    id: string;
    name: string;
    surname: string;
  }[];

  showParent?: boolean;

  academicYear?: string;

  rollNumber?: string;
}

export default function AcademicInformation({
  classes,
  parents = [],
  showParent = false,
  academicYear,
  rollNumber,
}: AcademicInformationProps) {
  const { watch, setValue } = useFormContext<StudentFormValues>();

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}

      <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
          <GraduationCap className="h-5 w-5 text-indigo-700" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Academic Information
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Class, parent and admission details.
          </p>
        </div>
      </div>

      {/* Body */}

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Class
          </label>

          <RadixSelect
            value={watch("classId") ? String(watch("classId")) : ""}
            onChange={(v) =>
              setValue("classId", Number(v), {
                shouldValidate: true,
              })
            }
            placeholder={
              classes.length > 0 ? "Select Class" : "No classes available"
            }
            disabled={classes.length === 0}
            options={classes.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
          />
        </div>

        {showParent && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Parent
            </label>

            <RadixSelect
              value={watch("parentId") ?? ""}
              onChange={(value) =>
                setValue("parentId", value ?? "", {
                  shouldValidate: true,
                })
              }
              placeholder="Select Parent"
              options={parents.map((parent) => ({
                value: parent.id,
                label: `${parent.name} ${parent.surname}`,
              }))}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Roll Number
          </label>

          <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-4">
            <span className="text-sm font-medium text-slate-600">
              {rollNumber ?? "Auto Generated"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Academic Year
          </label>

          <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-4">
            <span className="text-sm font-medium text-slate-900">
              {academicYear ?? "Current Academic Year"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
