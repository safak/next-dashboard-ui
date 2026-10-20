"use client";

import Image from "next/image";

interface EmptyParentsProps {
  search?: string;
  hasActiveFilters?: boolean;
}

export default function EmptyParents({
  search,
  hasActiveFilters = false,
}: EmptyParentsProps) {
  const isSearchEmpty = Boolean(search?.trim());

  if (isSearchEmpty || hasActiveFilters) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-6 text-center">
          <div className="relative mx-auto h-[190px] w-full max-w-[340px]">
            <Image
              src="/no-parents-found-removebg.png"
              alt="No parents found"
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
            No Parents Found
          </h2>

          {isSearchEmpty && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any parent matching{" "}
                <span className="font-semibold text-indigo-600">
                  &quot;{search}&quot;
                </span>
                .
              </p>

              <p className="mt-0.5 text-sm text-slate-400">
                Try searching with a different parent name, email or phone.
              </p>
            </>
          )}

          {!isSearchEmpty && hasActiveFilters && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any parents matching the selected filters.
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

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
      <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-6 text-center">
        <div className="relative mx-auto h-[190px] w-full max-w-[340px]">
          <Image
            src="/no-parents-found-removebg.png"
            alt="No parents created"
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
          No Parents Created Yet
        </h2>

        <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
          You haven&apos;t added any parents yet. Add your first parent to start
          managing parent accounts and student relationships.
        </p>
      </div>
    </div>
  );
}
