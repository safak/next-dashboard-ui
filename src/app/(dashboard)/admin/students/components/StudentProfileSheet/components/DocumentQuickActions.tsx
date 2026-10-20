"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Download, FolderPlus, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DocumentQuickActionsProps {
  studentId: string;

  onUpload?: () => void;
}

export default function DocumentQuickActions({
  studentId,
  onUpload,
}: DocumentQuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      title: "Upload Documents",
      description: "Upload new student documents",
      icon: FolderPlus,
      color: "text-blue-600",
      bg: "bg-blue-100",
      onClick: () => {
        onUpload?.();
      },
    },
    {
      title: "Download All Documents",
      description: "Download documents as ZIP",
      icon: Download,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      onClick: () => {
        console.log("Download All");
      },
    },
    {
      title: "Print Document Checklist",
      description: "Printable admission checklist",
      icon: Printer,
      color: "text-violet-600",
      bg: "bg-violet-100",
      onClick: () => {
        console.log("Print Checklist");
      },
    },
    {
      title: "Open Documents Module",
      description: "Manage all student documents",
      icon: ArrowRight,
      color: "text-orange-600",
      bg: "bg-orange-100",
      onClick: () => router.push(`/admin/students/${studentId}/documents`),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b bg-slate-50 px-6 py-4">
        <h3 className="font-semibold text-slate-900">Quick Actions</h3>

        <p className="mt-1 text-sm text-slate-500">
          Frequently used document actions
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
              onClick={action.onClick}
              className="h-16 w-full justify-between rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.bg}`}
                >
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>

                <div className="text-left">
                  <p className="font-medium text-slate-900">{action.title}</p>

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
