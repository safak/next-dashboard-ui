"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  onCreate: () => void;
  search?: string;
  hasActiveFilters?: boolean;
}

export default function EmptyFeeStructures({
  onCreate,
  search,
  hasActiveFilters = false,
}: Props) {
  const isSearchEmpty = Boolean(search?.trim());

  if (isSearchEmpty || hasActiveFilters) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
        <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-6 text-center">
          <div className="relative mx-auto h-[180px] w-full max-w-[340px]">
            <Image
              src="/no-fee-structures-found-removebg.png"
              alt="No fee structures found"
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            No Fee Structures Found
          </h2>

          {isSearchEmpty && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any fee structure matching{" "}
                <span className="font-semibold text-indigo-600">
                  &quot;{search}&quot;
                </span>
                .
              </p>

              <p className="mt-0.5 text-sm text-slate-400">
                Try searching with a different class or fee structure name.
              </p>
            </>
          )}

          {!isSearchEmpty && hasActiveFilters && (
            <>
              <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
                We couldn&apos;t find any fee structures matching the selected
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
      <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-6 text-center">
        <div className="relative mx-auto h-[180px] w-full max-w-[340px]">
          <Image
            src="/no-fee-structures-found-removebg.png"
            alt="No fee structures created"
            className="h-full w-full object-contain"
          />
        </div>

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          No Fee Structures Created Yet
        </h2>

        <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
          You haven&apos;t created any fee structures yet. Create your first fee
          structure to start managing class fees.
        </p>
      </div>
    </div>
  );
}