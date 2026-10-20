"use client";

import { LockKeyhole, Monitor, ShieldCheck } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">
          Account & Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Protect your account and manage access
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        <SecurityRow
          icon={<LockKeyhole className="h-4 w-4 text-blue-600" />}
          iconBg="bg-blue-50"
          title="Change Password"
          desc="Update your account password"
          action="Update"
        />

        <SecurityRow
          icon={<Monitor className="h-4 w-4 text-slate-600" />}
          iconBg="bg-slate-100"
          title="Active Sessions"
          desc="Devices currently logged into your account"
          action="View"
        />

        <SecurityRow
          icon={<ShieldCheck className="h-4 w-4 text-green-600" />}
          iconBg="bg-green-50"
          title="Two-Factor Authentication"
          desc="Add an extra layer of protection to your account"
          action="Configure"
        />
      </div>
    </div>
  );
}

function SecurityRow({
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
  action: string;
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

      <button
        type="button"
        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
      >
        {action}
      </button>
    </div>
  );
}
