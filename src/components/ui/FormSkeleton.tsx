import LoadingSkeleton from "./LoadingSkeleton";

interface FormSkeletonProps {
  fields?: number;
}

export default function FormSkeleton({
  fields = 8,
}: FormSkeletonProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <LoadingSkeleton className="mb-8 h-8 w-56" />

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index}>
            <LoadingSkeleton className="mb-2 h-4 w-28" />

            <LoadingSkeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <LoadingSkeleton className="h-10 w-24 rounded-lg" />

        <LoadingSkeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}