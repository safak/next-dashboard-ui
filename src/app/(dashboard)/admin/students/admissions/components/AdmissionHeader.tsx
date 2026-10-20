import { GraduationCap, CalendarDays } from "lucide-react";

interface AdmissionHeaderProps {
  academicYear?: string;
}

export default function AdmissionHeader({
  academicYear,
}: AdmissionHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100">
            <GraduationCap className="h-7 w-7 text-sky-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Student Admissions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Register new students into the current academic year and manage
              admissions efficiently.
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2">
              <CalendarDays className="h-5 w-5 text-indigo-700" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Academic Year
              </p>

              <p className="text-lg font-semibold text-slate-900">
                {academicYear ?? "Not Configured"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}