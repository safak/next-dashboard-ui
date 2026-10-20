import { GraduationCap, Mars, Venus, UserPlus } from "lucide-react";

interface StudentOverviewProps {
  totalStudents: number;
  boys: number;
  girls: number;
  todayAdmissions: number;
}

export default function StudentOverviewCard({
  totalStudents,
  boys,
  girls,
  todayAdmissions,
}: StudentOverviewProps) {
  const metrics = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: GraduationCap,
      iconColor: "#4B517D",
      iconBg: "#EEF2FF",
    },
    {
      title: "Today's Admissions",
      value: todayAdmissions,
      icon: UserPlus,
      iconColor: "#F59A23",
      iconBg: "#FFF4E4",
    },
    {
      title: "Boys",
      value: boys,
      icon: Mars,
      iconColor: "#5B8DEF",
      iconBg: "#EEF5FF",
    },
    {
      title: "Girls",
      value: girls,
      icon: Venus,
      iconColor: "#D86A9A",
      iconBg: "#FCEFF5",
    },
  ];

  return (
    <div
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white 
      p-4 shadow-[0_8px_30px_rgba(75,81,125,0.06)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#303552]">Student Overview</h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Student population and admissions
          </p>
        </div>

        <GraduationCap className="h-4 w-4 text-[#4B517D]" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.title}
              className="flex min-w-0 items-center justify-between rounded-xl border border-slate-100 
              bg-slate-50/60 px-3 py-2.5 transition-all duration-200 hover:border-slate-200 
              hover:bg-white hover:shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-[9px] font-medium text-slate-400">
                  {metric.title}
                </p>

                <p className="mt-1 text-lg font-bold leading-none text-[#303552]">
                  {metric.value}
                </p>
              </div>

              <div
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: metric.iconBg,
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  style={{
                    color: metric.iconColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
