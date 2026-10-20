"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  onCreate: () => void;
  search?: string;
  hasActiveFilters?: boolean;
}

function EmptyIllustration({ alt }: { alt: string }) {
  return (
    <div className="mx-auto flex h-[210px] w-full max-w-[360px] items-center justify-center">
      <Image
        src="/no-admissions-found-removebg.png"
        alt={alt}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function EmptyAdmissions({
  onCreate,
  search,
  hasActiveFilters = false,
}: Props) {
  const isSearchEmpty = Boolean(search?.trim());
  const isFiltered = isSearchEmpty || hasActiveFilters;

  if (isFiltered) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
        <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-8 text-center">
          <EmptyIllustration alt="No admissions found" />

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            No Admissions Found
          </h2>

          {isSearchEmpty && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any admission matching{" "}
                <span className="font-semibold text-indigo-600">
                  &quot;{search}&quot;
                </span>
                .
              </p>

              <p className="mt-0.5 text-sm text-slate-400">
                Try searching with a different student, parent, admission, or
                class name.
              </p>
            </>
          )}

          {!isSearchEmpty && hasActiveFilters && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any admissions matching the selected
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

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
      <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-8 text-center">
        <EmptyIllustration alt="No admissions created" />

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          No Admissions Created Yet
        </h2>

        <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
          You haven&apos;t created any student admissions yet. Create your first
          admission to start managing student enrollment.
        </p>
      </div>
    </div>
  );
}
