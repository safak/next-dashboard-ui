"use client";

interface EnrollmentItem {
  id: number;
  name: string;
  boys: number;
  girls: number;
  total: number;
}

interface EnrollmentDistributionProps {
  data: EnrollmentItem[];
}

const COLORS = ["#5B8DEF", "#F472B6", "#F5B83D", "#8B6FE8", "#4CC38A"];

export function EnrollmentOverviewCard({ data }: EnrollmentDistributionProps) {
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.boys, item.girls)),
    10,
  );

  return (
    <div className="h-full min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(75,81,125,0.06)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[#303552]">
          Enrollment Overview
        </h3>

        <div className="flex shrink-0 items-center gap-3 text-[9px]">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#5B8DEF]" />
            Boys
          </span>

          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#F472B6]" />
            Girls
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[170px] items-center justify-center text-xs text-slate-400">
          No enrollment data available
        </div>
      ) : (
        <div className="flex h-[165px]">
          <div className="relative w-7 shrink-0">
            <div className="absolute inset-0 flex flex-col justify-between pb-6 pt-1 text-[8px] text-slate-400">
              <span>{maxValue}</span>
              <span>{Math.round(maxValue * 0.75)}</span>
              <span>{Math.round(maxValue * 0.5)}</span>
              <span>{Math.round(maxValue * 0.25)}</span>
              <span>0</span>
            </div>
          </div>

          <div className="relative min-w-0 flex-1">
            <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((line) => (
                <div key={line} className="border-t border-slate-100" />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-6 top-0 flex items-end justify-around gap-1 px-1">
              {data.map((item) => {
                const boysHeight =
                  maxValue === 0 ? 0 : (item.boys / maxValue) * 100;

                const girlsHeight =
                  maxValue === 0 ? 0 : (item.girls / maxValue) * 100;

                return (
                  <div
                    key={item.id}
                    className="flex h-full min-w-0 flex-1 items-end justify-center gap-1"
                  >
                    <div
                      className="w-3 rounded-t-[3px] bg-[#5B8DEF] sm:w-4"
                      style={{
                        height: `${Math.max(
                          boysHeight,
                          item.boys > 0 ? 3 : 0,
                        )}%`,
                      }}
                      title={`${item.name} Boys: ${item.boys}`}
                    />

                    <div
                      className="w-3 rounded-t-[3px] bg-[#F472B6] sm:w-4"
                      style={{
                        height: `${Math.max(
                          girlsHeight,
                          item.girls > 0 ? 3 : 0,
                        )}%`,
                      }}
                      title={`${item.name} Girls: ${item.girls}`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex h-5 items-end justify-around gap-1 px-1">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="min-w-0 flex-1 truncate text-center text-[8px] font-medium text-slate-500"
                  title={item.name}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentDistributionCard({ data }: EnrollmentDistributionProps) {
  const totalStudents = data.reduce((sum, item) => sum + item.total, 0);

  let currentPercentage = 0;

  const distribution = data.map((item, index) => {
    const percentage =
      totalStudents === 0 ? 0 : (item.total / totalStudents) * 100;

    const start = currentPercentage;

    currentPercentage += percentage;

    return {
      ...item,
      percentage,
      start,
      end: currentPercentage,
      color: COLORS[index % COLORS.length],
    };
  });

  const gradient =
    totalStudents === 0
      ? "#E5E7EB"
      : `conic-gradient(${distribution
          .map((item) => `${item.color} ${item.start}% ${item.end}%`)
          .join(", ")})`;

  return (
    <div className="h-full min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(75,81,125,0.06)]">
      <h3 className="text-sm font-bold text-[#303552]">Student Distribution</h3>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex h-[115px] w-[115px] shrink-0 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: gradient,
            }}
          />

          <div className="relative flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full bg-white">
            <span className="text-lg font-bold leading-none text-[#303552]">
              {totalStudents}
            </span>

            <span className="mt-1 text-[8px] text-slate-400">Students</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {distribution.map((item) => (
            <div key={item.id} className="flex items-center gap-1.5 text-[9px]">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="min-w-0 flex-1 truncate text-slate-500">
                {item.name}
              </span>

              <span className="font-semibold text-slate-600">{item.total}</span>
            </div>
          ))}

          {distribution.length === 0 && (
            <span className="text-xs text-slate-400">No student data</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EnrollmentDistribution({
  data,
}: EnrollmentDistributionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
      <EnrollmentOverviewCard data={data} />
      <StudentDistributionCard data={data} />
    </div>
  );
}
