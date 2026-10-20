"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import {
  Bell,
  BookOpen,
  GraduationCap,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import type {
  AnnouncementPriorityFilter,
  AnnouncementStatusFilter,
  ClassOption,
} from "../types";

interface AnnouncementsFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  priorityFilter: AnnouncementPriorityFilter;
  onPriorityFilterChange: (value: AnnouncementPriorityFilter) => void;

  statusFilter: AnnouncementStatusFilter;
  onStatusFilterChange: (value: AnnouncementStatusFilter) => void;

  classes: ClassOption[];

  onReset: () => void;
}

export default function AnnouncementsFiltersDrawer({
  open,
  onOpenChange,

  classFilter,
  onClassFilterChange,

  priorityFilter,
  onPriorityFilterChange,

  statusFilter,
  onStatusFilterChange,

  classes,

  onReset,
}: AnnouncementsFiltersDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Announcement Filters"
      description="Narrow down the announcement list using the filters below."
      icon={<SlidersHorizontal className="h-4 w-4" />}
      footer={
        <div className="flex w-full items-center justify-between">
          <Button type="button" variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button type="button" onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Class */}
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
              ...classes.map((item) => ({
                value: String(item.id),
                label: item.name,
              })),
            ]}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Priority</span>
          </label>

          <RadixSelect
            value={priorityFilter}
            onChange={(value) =>
              onPriorityFilterChange(value as AnnouncementPriorityFilter)
            }
            placeholder="All Priorities"
            options={[
              {
                value: "all",
                label: "All Priorities",
              },
              {
                value: "URGENT",
                label: "Urgent",
              },
              {
                value: "HIGH",
                label: "High",
              },
              {
                value: "NORMAL",
                label: "Normal",
              },
              {
                value: "LOW",
                label: "Low",
              },
            ]}
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-blue-500" />
            <span>Status</span>
          </label>

          <RadixSelect
            value={statusFilter}
            onChange={(value) =>
              onStatusFilterChange(value as AnnouncementStatusFilter)
            }
            placeholder="All Statuses"
            options={[
              {
                value: "all",
                label: "All Statuses",
              },
              {
                value: "published",
                label: "Published",
              },
              {
                value: "draft",
                label: "Draft",
              },
              {
                value: "expired",
                label: "Expired",
              },
            ]}
          />
        </div>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Combine
            class, priority and status filters to quickly find the announcements
            you need.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
