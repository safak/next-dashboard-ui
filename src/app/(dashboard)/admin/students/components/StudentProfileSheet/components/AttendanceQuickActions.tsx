"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AttendanceQuickActionsProps {
  studentId: string;
}

export default function AttendanceQuickActions({
  studentId,
}: AttendanceQuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      title: "View Complete Attendance",
      description: "Open full attendance module",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-100",
      onClick: () => router.push(`/admin/attendance?student=${studentId}`),
    },
    {
      title: "Download Attendance Report",
      description: "Export attendance as Excel/PDF",
      icon: Download,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      onClick: () => {
        console.log("Download Attendance");
      },
    },
    {
      title: "Print Attendance Report",
      description: "Print attendance summary",
      icon: Printer,
      color: "text-violet-600",
      bg: "bg-violet-100",
      onClick: () => {
        console.log("Print Attendance");
      },
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b bg-slate-50 px-6 py-4">
        <h3 className="font-semibold text-slate-900">Quick Actions</h3>

        <p className="mt-1 text-sm text-slate-500">
          Attendance related shortcuts
        </p>
      </div>

      {/* Actions */}

      <div className="space-y-3 p-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-16 w-full justify-between"
              onClick={action.onClick}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.bg}`}
                >
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>

                <div className="text-left">
                  <p className="font-medium">{action.title}</p>

                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
