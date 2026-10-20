"use client";

import { Eye, FileText, UserCheck } from "lucide-react";

export default function PrivacySettingsPage() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">
          Privacy & Permissions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Control access and visibility
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        <PrivacyRow
          icon={<UserCheck className="h-4 w-4 text-blue-600" />}
          iconBg="bg-blue-50"
          title="Role"
          desc="Administrator"
        />

        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Eye className="h-4 w-4 text-violet-600" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Data Visibility
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Control who can view application data
              </p>
            </div>
          </div>

          <select
            defaultValue="Admins Only"
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          >
            <option>Admins Only</option>
            <option>Staff</option>
            <option>Everyone</option>
          </select>
        </div>

        <PrivacyRow
          icon={<FileText className="h-4 w-4 text-amber-600" />}
          iconBg="bg-amber-50"
          title="Audit Logs"
          desc="View system activity and administrative actions"
          action="View Logs"
        />
      </div>
    </div>
  );
}

function PrivacyRow({
  icon,
  iconBg,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{title}</p>

          <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
        </div>
      </div>

      {action && (
        <button
          type="button"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          {action}
        </button>
      )}
    </div>
  );
}
