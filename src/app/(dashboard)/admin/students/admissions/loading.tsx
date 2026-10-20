export default function AdmissionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-56 rounded bg-slate-200" />
        <div className="h-10 w-36 rounded-lg bg-slate-200" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border bg-slate-100"
          />
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white p-6">
        <div className="mb-4 h-6 w-48 rounded bg-slate-200" />

        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 rounded bg-slate-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}