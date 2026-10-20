"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Eye, Laptop, LockKeyhole, Settings2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const tabs = [
  {
    label: "Account & Security",
    href: "/admin/settings/security",
    icon: LockKeyhole,
  },
  {
    label: "Notifications",
    href: "/admin/settings/notifications",
    icon: Bell,
  },
  {
    label: "Privacy & Permissions",
    href: "/admin/settings/privacy",
    icon: Eye,
  },
  {
    label: "Appearance",
    href: "/admin/settings/appearance",
    icon: Laptop,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full px-4 py-4 sm:px-1 lg:py-1">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Settings"
          subtitle="Manage your account and application preferences."
          image="/systemsettings-icon.png"
          imageClassName="h-10 w-10"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[190px_minmax(0,1fr)] py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = pathname.startsWith(tab.href);

              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => router.push(tab.href)}
                  className={[
                    "flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition",
                    active
                      ? "border-blue-200 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
