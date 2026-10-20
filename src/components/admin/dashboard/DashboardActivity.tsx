import { formatDistanceToNow } from "date-fns";
import {
  CalendarClock,
  IndianRupee,
  Megaphone,
  UserPlus,
} from "lucide-react";

interface ActivityItem {
  id: string | number;
  type: "LEAVE" | "PAYMENT" | "LEAD" | "ANNOUNCEMENT";
  title: string;
  description: string;
  createdAt: Date;
}

interface DashboardActivityProps {
  activities: ActivityItem[];
}

const activityConfig = {
  LEAVE: {
    icon: CalendarClock,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },

  PAYMENT: {
    icon: IndianRupee,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },

  LEAD: {
    icon: UserPlus,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },

  ANNOUNCEMENT: {
    icon: Megaphone,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
};

export default function DashboardActivity({
  activities,
}: DashboardActivityProps) {
  const latestActivities = activities.slice(0, 3);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h3 className="text-sm font-bold text-[#303552]">
          Recent Activities
        </h3>

        <button
          type="button"
          className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {latestActivities.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-slate-400">
            No recent activities
          </div>
        ) : (
          latestActivities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-slate-50"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {activity.description}
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}