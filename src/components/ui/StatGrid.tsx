import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatGridProps {
  children: ReactNode;

  className?: string;

  /**
   * Number of columns on xl screens.
   * Default: 4
   */
  columns?: 2 | 3 | 4 | 5 | 6;
}

const columnClasses = {
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
};

export default function StatGrid({
  children,
  className,
  columns = 4,
}: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-5",
        "grid-cols-1",
        "sm:grid-cols-2",
        columnClasses[columns],
        className
      )}
    >
      {children}
    </div>
  );
}