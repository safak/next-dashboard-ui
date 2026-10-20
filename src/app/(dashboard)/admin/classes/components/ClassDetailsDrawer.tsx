"use client";

import {
  Building2,
  GraduationCap,
  Hash,
  Users,
  UserRound,
  X,
} from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import { Prisma } from "@prisma/client";

type ClassRow = Prisma.ClassGetPayload<{
  include: {
    supervisor: {
      select: {
        id: true;
        name: true;
        surname: true;
      };
    };
    _count: {
      select: {
        students: true;
      };
    };
  };
}>;

interface ClassDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: ClassRow | null;
}

export default function ClassDetailsDrawer({
  open,
  onOpenChange,
  classData,
}: ClassDetailsDrawerProps) {
  if (!classData) {
    return null;
  }

  const studentCount = classData._count.students;
  const capacity = classData.capacity;

  const occupancyPercentage =
    capacity > 0
      ? Math.min(Math.round((studentCount / capacity) * 100), 100)
      : 0;

  const isFull = studentCount >= capacity;

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Class Details"
      description="View the details of this academic class."
      width="sm"
      icon={<Building2 className="h-6 w-6" />}
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* ==================================================
            CLASS OVERVIEW
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {classData.name}
              </h2>

              <p className="text-sm text-slate-500">Academic Class</p>
            </div>
          </div>
        </div>

        {/* ==================================================
            CLASS INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Class Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Basic information about this class.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Class Teacher */}

            <div className="rounded-lg bg-violet-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <UserRound className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Class Teacher
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {classData.supervisor.name} {classData.supervisor.surname}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Class Supervisor
              </p>
            </div>

            {/* Roll Prefix */}

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Hash className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Roll Prefix
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                #{classData.rollPrefix}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Student roll number prefix
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            STUDENT CAPACITY
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Student Capacity
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Current class occupancy.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>

          {/* Count */}

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {studentCount}
                <span className="ml-1 text-base font-medium text-slate-400">
                  / {capacity}
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {capacity - studentCount > 0
                  ? `${capacity - studentCount} seats available`
                  : "No seats available"}
              </p>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isFull ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              }`}
            >
              {occupancyPercentage}%
            </span>
          </div>

          {/* Progress */}

          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  isFull ? "bg-red-400" : "bg-indigo-400"
                }`}
                style={{
                  width: `${occupancyPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            QUICK STATS
        ================================================== */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-600" />

              <span className="text-xs font-medium text-slate-500">
                Students
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {studentCount}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-medium text-slate-500">
                Available Seats
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {Math.max(capacity - studentCount, 0)}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
