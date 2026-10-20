import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200",
        className
      )}
    />
  );
}