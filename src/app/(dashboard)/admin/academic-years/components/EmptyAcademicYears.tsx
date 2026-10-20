"use client";

import Image from "next/image";

interface EmptyAcademicYearsProps {
  search?: string;
}

export default function EmptyAcademicYears({
  search,
}: EmptyAcademicYearsProps) {
  const isSearchEmpty = Boolean(search?.trim());

  if (isSearchEmpty) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-6 text-center">
          <div className="relative mx-auto h-[190px] w-full max-w-[340px]">
            <Image
              src="/no-academic-years-found-removebg.png"
              alt="No academic years found"
              className="
                absolute
                left-1/2
                top-1/2
                h-[190px]
                w-auto
                max-w-none
                -translate-x-1/2
                -translate-y-1/2
                object-contain
              "
            />
          </div>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            No Academic Years Found
          </h2>

          <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
            We couldn&apos;t find any academic year matching{" "}
            <span className="font-semibold text-indigo-600">&quot;{search}&quot;</span>.
          </p>

          <p className="mt-0.5 text-sm text-slate-400">
            Try searching with a different academic year.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
      <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-6 text-center">
        <div className="relative mx-auto h-[190px] w-full max-w-[340px]">
          <Image
            src="/no-academic-years-found-removebg.png"
            alt="No academic years created"
            className="
              absolute
              left-1/2
              top-1/2
              h-[190px]
              w-auto
              max-w-none
              -translate-x-1/2
              -translate-y-1/2
              object-contain
            "
          />
        </div>

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          No Academic Years Created Yet
        </h2>

        <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
          You haven&apos;t created any academic years yet. Create your first academic
          year to start managing your school&apos;s academic calendar.
        </p>
      </div>
    </div>
  );
}
