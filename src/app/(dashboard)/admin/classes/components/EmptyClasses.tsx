"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  onCreate: () => void;
  search?: string;
  hasActiveFilters?: boolean;
}

export default function EmptyClasses({
  onCreate,
  search,
  hasActiveFilters = false,
}: Props) {
  const isSearchEmpty = Boolean(search?.trim());

  // --------------------------------------------------
  // Search / Filter returned no results
  // --------------------------------------------------

  if (isSearchEmpty || hasActiveFilters) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
        <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-6 text-center">
          {/* Illustration */}

          <div className="relative mx-auto h-[165px] w-full max-w-[340px] overflow-hidden">
            <Image
              src="/no-classes-found-removebg.png"
              alt="No classes found"
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
            No Classes Found
          </h2>

          {/* Search message */}

          {isSearchEmpty && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any class matching{" "}
                <span className="font-semibold text-indigo-600">
                  &quot;{search}&quot;
                </span>
                .
              </p>

              <p className="mt-0.5 text-sm text-slate-400">
                Try searching with a different class name.
              </p>
            </>
          )}

          {/* Filter message */}

          {!isSearchEmpty && hasActiveFilters && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any classes matching the selected
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
  // No classes exist at all
  // --------------------------------------------------

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
      <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-6 text-center">
        {/* Illustration */}

        <div className="relative mx-auto h-[165px] w-full max-w-[340px] overflow-hidden">
          <Image
            src="/no-classes-found-removebg.png"
            alt="No classes created"
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
          No Classes Created Yet
        </h2>

        {/* Description */}

        <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
          You haven&apos;t created any classes yet. Create your
          first class to start managing students.
        </p>
      </div>
    </div>
  );
}