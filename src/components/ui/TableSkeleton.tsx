import LoadingSkeleton from "./LoadingSkeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 8,
  columns = 6,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      {/* Header */}

      <div className="border-b p-4">
        <LoadingSkeleton className="h-6 w-48" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <tbody>
            {Array.from({ length: rows }).map((_, row) => (
              <tr
                key={row}
                className="border-b"
              >
                {Array.from({ length: columns }).map((_, col) => (
                  <td
                    key={col}
                    className="px-6 py-4"
                  >
                    <LoadingSkeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}