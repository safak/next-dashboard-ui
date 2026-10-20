// src/components/admin/dashboard/DashboardQuickActions.tsx

import Link from "next/link";
import {
  UserPlus,
  GraduationCap,
  IndianRupee,
  BookOpen,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";

const actions = [
  {
    title: "Add Student",
    href: "/admin/admissions/new",
    icon: GraduationCap,
    color: "bg-[#EEF6FF] text-[#3B82F6]",
  },
  {
    title: "Add Teacher",
    href: "/admin/teachers",
    icon: UserPlus,
    color: "bg-[#FFF0F6] text-[#EC4899]",
  },
  {
    title: "Create Class",
    href: "/admin/classes",
    icon: BookOpen,
    color: "bg-[#FFF8E8] text-[#F59E0B]",
  },
  {
    title: "Mark Attendance",
    href: "/admin/teacher-attendance",
    icon: ClipboardCheck,
    color: "bg-[#E9FBF1] text-[#16A34A]",
  },
  {
    title: "Collect Fee",
    href: "/admin/fees",
    icon: IndianRupee,
    color: "bg-[#F4EEFF] text-[#8B5CF6]",
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
    color: "bg-[#FFF1E8] text-[#F97316]",
  },
];

export default function DashboardQuickActions() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-sm font-bold text-[#303552]">Quick Actions</h2>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Frequently used administrative actions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex min-h-[72px] flex-col items-center justify-center rounded-lg px-2 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B517D] ${action.color}`}
            >
              <Icon
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={2}
              />

              <span className="mt-2 text-center text-[10px] font-semibold leading-tight text-[#303552]">
                {action.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
