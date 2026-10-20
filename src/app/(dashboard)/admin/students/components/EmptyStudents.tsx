"use client";

import Image from "next/image";

interface EmptyStudentsProps {
  title?: string;
  description?: string;
  search?: string;
  hasActiveFilters?: boolean;
}

export default function EmptyStudents({
  title,
  description,
  search,
  hasActiveFilters = false,
}: EmptyStudentsProps) {
  const isSearchEmpty = Boolean(search?.trim());

  // --------------------------------------------------
  // Search / Filter returned no results
  // --------------------------------------------------

  if (isSearchEmpty || hasActiveFilters) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
        <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-6 text-center">
          {/* Illustration */}

          <div className="relative mx-auto h-[150px] w-full max-w-[340px] overflow-hidden">
            <Image
              src="/no-students-found-removebg.png"
              alt="No students found"
              className="
                absolute
                left-1/2
                top-0
                h-auto
                w-[340px]
                max-w-none
                -translate-x-1/2
              "
            />
          </div>

          {/* Title */}

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            {title ?? "No Students Found"}
          </h2>

          {/* Search Result */}

          {isSearchEmpty && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any student matching{" "}
                <span className="font-semibold text-indigo-600">
                  &quot;{search}&quot;
                </span>
                .
              </p>

              <p className="mt-0.5 text-sm text-slate-400">
                Try searching with a different student name, admission number,
                or roll number.
              </p>
            </>
          )}

          {/* Filter Result */}

          {!isSearchEmpty && hasActiveFilters && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any students matching the selected
                filters.
              </p>

              <p className="mt-0.5 text-sm text-slate-400">
                Try adjusting or clearing your filters.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // No students exist at all
  // --------------------------------------------------

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
      <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-6 text-center">
        {/* Illustration */}

        <div className="relative mx-auto h-[150px] w-full max-w-[340px] overflow-hidden">
          <Image
            src="/no-students-found-removebg.png"
            alt="No students found"
            width={340}
            height={340}
            className="
    absolute
    left-1/2
    top-0
    h-auto
    w-[340px]
    max-w-none
    -translate-x-1/2
  "
          />
        </div>

        {/* Title */}

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          {title ?? "No Students Yet"}
        </h2>

        {/* Description */}

        <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
          {description ??
            "There are no enrolled students yet. Use the Add Student button above to create the first admission."}
        </p>
      </div>
    </div>
  );
}
