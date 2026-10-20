import Link from "next/link";
import { ChevronRight, CalendarClock, ClipboardCheck } from "lucide-react";

interface DashboardPendingProps {
  teacherLeaves?: number;
}

export default function DashboardPending({
  teacherLeaves = 0,
}: DashboardPendingProps) {
  const pendingItems = [
    {
      title: "Teacher Leave Requests",
      subtitle: "Awaiting approval",
      count: teacherLeaves,
      href: "/admin/teacher-leaves",
      icon: CalendarClock,
      color: "text-[#F59A23]",
      bg: "bg-[#FFF4E4]",
    },
  ];

  const totalOpen = pendingItems.reduce((total, item) => total + item.count, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-[#4B517D]">
          Pending Actions
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            totalOpen > 0
              ? "bg-[#FFF4E4] text-[#D97706]"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {totalOpen} Open
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {pendingItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="
                group
                flex
                items-center
                justify-between
                px-5
                py-4
                transition-colors
                duration-200
                hover:bg-[#F8F8FC]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${item.bg}
                  `}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>

                  <p className="text-xs text-slate-500">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-full
                    px-2
                    text-sm
                    font-semibold
                    ${
                      item.count > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-600"
                    }
                  `}
                >
                  {item.count}
                </span>

                <ChevronRight
                  className="
                    h-4
                    w-4
                    text-slate-400
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
