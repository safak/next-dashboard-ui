import LoadingSkeleton from "./LoadingSkeleton";

interface CardSkeletonProps {
  count?: number;
}

export default function CardSkeleton({
  count = 4,
}: CardSkeletonProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="flex justify-between">
            <div className="space-y-3">
              <LoadingSkeleton className="h-4 w-28" />

              <LoadingSkeleton className="h-8 w-20" />

              <LoadingSkeleton className="h-3 w-36" />
            </div>

            <LoadingSkeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}