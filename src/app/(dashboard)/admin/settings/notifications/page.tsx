"use client";

import { Bell, Mail, Megaphone } from "lucide-react";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState({
    email: true,
    system: true,
    announcements: true,
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">Notifications</h2>

        <p className="mt-1 text-sm text-slate-500">
          Control how you receive notifications
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        <ToggleRow
          icon={<Mail className="h-4 w-4 text-blue-600" />}
          iconBg="bg-blue-50"
          title="Email Notifications"
          desc="Receive important updates and account notifications by email"
          checked={prefs.email}
          onToggle={() =>
            setPrefs((p) => ({
              ...p,
              email: !p.email,
            }))
          }
        />

        <ToggleRow
          icon={<Bell className="h-4 w-4 text-amber-600" />}
          iconBg="bg-amber-50"
          title="System Alerts"
          desc="Receive important alerts and system activity notifications"
          checked={prefs.system}
          onToggle={() =>
            setPrefs((p) => ({
              ...p,
              system: !p.system,
            }))
          }
        />

        <ToggleRow
          icon={<Megaphone className="h-4 w-4 text-violet-600" />}
          iconBg="bg-violet-50"
          title="Announcements"
          desc="Receive notifications when new announcements are published"
          checked={prefs.announcements}
          onToggle={() =>
            setPrefs((p) => ({
              ...p,
              announcements: !p.announcements,
            }))
          }
        />
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  iconBg,
  title,
  desc,
  checked,
  onToggle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
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
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        aria-pressed={checked}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
