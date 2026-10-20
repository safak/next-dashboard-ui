interface DataTableLoadingProps {
  rows?: number;
  columns?: number;
}

export default function DataTableLoading({
  rows = 8,
  columns = 6,
}: DataTableLoadingProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {/* Header */}
      <div className="grid border-b bg-slate-50 p-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="h-4 animate-pulse rounded bg-slate-200"
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 animate-pulse rounded bg-slate-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}