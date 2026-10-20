"use client";

interface LoadingStateProps {
  rows?: number;
  cards?: number;
}

export default function LoadingState({
  rows = 4,
  cards = 4,
}: LoadingStateProps) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="h-4 w-96 rounded bg-slate-200" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="h-14 rounded-xl border border-slate-200 bg-slate-100" />

      {/* List/Table */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}