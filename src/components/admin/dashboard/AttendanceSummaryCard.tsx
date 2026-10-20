import {
  UserCheck,
  UserX,
  Users,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

interface AttendanceSummaryProps {
  studentPresent: number;
  studentAbsent: number;
  teacherPresent: number;
  teacherAbsent: number;
  attendanceRate: number;
}

export default function AttendanceSummaryCard({
  studentPresent,
  studentAbsent,
  teacherPresent,
  teacherAbsent,
  attendanceRate,
}: AttendanceSummaryProps) {
  const metrics = [
    {
      title: "Student Present",
      value: studentPresent,
      icon: GraduationCap,
      iconColor: "#16A34A",
      iconBg: "#ECFDF3",
    },
    {
      title: "Teacher Present",
      value: teacherPresent,
      icon: Users,
      iconColor: "#4B517D",
      iconBg: "#EEF2FF",
    },
    {
      title: "Student Absent",
      value: studentAbsent,
      icon: UserX,
      iconColor: "#EF4444",
      iconBg: "#FEF2F2",
    },
    {
      title: "Teacher Absent",
      value: teacherAbsent,
      icon: UserX,
      iconColor: "#F59A23",
      iconBg: "#FFF4E4",
    },
  ];

  const safeAttendanceRate = Math.min(100, Math.max(0, attendanceRate));

  return (
    <div
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white 
      p-4 shadow-[0_8px_30px_rgba(75,81,125,0.06)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#303552]">Attendance Today</h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Student and teacher attendance
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <ClipboardCheck className="h-4 w-4 text-[#4B517D]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.title}
              className="flex min-w-0 items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
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

      {/* <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EEF2FF]">
              <UserCheck className="h-3.5 w-3.5 text-[#4B517D]" />
            </span>

            <span className="text-[10px] font-medium text-slate-500">
              Overall Attendance
            </span>
          </div>

          <span className="text-sm font-bold text-[#4B517D]">
            {safeAttendanceRate}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#4B517D] transition-all duration-500"
            style={{
              width: `${safeAttendanceRate}%`,
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
