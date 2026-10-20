"use client";

import { ArrowRight, GraduationCap, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  selectedCount: number;

  currentAcademicYear: string;
  nextAcademicYear: string;

  currentClass: string;
  destinationClass: string;

  loading?: boolean;

  onPromote: () => void;
}

export default function PromotionConfirmationCard({
  selectedCount,
  currentAcademicYear,
  nextAcademicYear,
  currentClass,
  destinationClass,
  loading = false,
  onPromote,
}: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
      <div className="border-b border-amber-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Promotion Summary
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Review the promotion before continuing.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">

        <div className="space-y-5">

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Current Academic Year
            </span>

            <span className="font-medium">
              {currentAcademicYear}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Next Academic Year
            </span>

            <span className="font-medium">
              {nextAcademicYear}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Current Class
            </span>

            <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
              {currentClass}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Destination Class
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              {destinationClass}
            </span>
          </div>

        </div>

        <div className="flex flex-col justify-between rounded-xl border bg-white p-5">

          <div>

            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Students Selected
                </p>

                <p className="text-3xl font-bold">
                  {selectedCount}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
              <GraduationCap className="h-5 w-5" />

              This action cannot be undone.
            </div>

          </div>

          <Button
            onClick={onPromote}
            disabled={loading}
            className="mt-6"
          >
            <ArrowRight className="mr-2 h-4 w-4" />

            {loading
              ? "Promoting..."
              : `Promote ${selectedCount} Student${selectedCount > 1 ? "s" : ""}`}
          </Button>

        </div>

      </div>
    </div>
  );
}