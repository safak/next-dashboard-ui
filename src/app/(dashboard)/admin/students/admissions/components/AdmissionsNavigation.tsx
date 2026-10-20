"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock3,
  BadgeCheck,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const items = [
  {
    label: "Dashboard",
    href: "/admin/students/admissions",
    icon: LayoutDashboard,
  },
  {
    label: "Pending",
    href: "/admin/students/admissions/pending",
    icon: Clock3,
  },
  {
    label: "Verification",
    href: "/admin/students/admissions/verification",
    icon: ShieldCheck,
  },
  {
    label: "Approved",
    href: "/admin/students/admissions/approved",
    icon: BadgeCheck,
  },
  {
    label: "Rejected",
    href: "/admin/students/admissions/rejected",
    icon: XCircle,
  },
];

export default function AdmissionsNavigation() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/students/admissions" &&
              pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}