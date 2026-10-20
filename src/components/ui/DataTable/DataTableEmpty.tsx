import { LucideIcon, SearchX } from "lucide-react";

interface DataTableEmptyProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export default function DataTableEmpty({
  title = "No records found",
  description = "There are no records matching your current filters.",
  icon: Icon = SearchX,
}: DataTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-14">
      <div className="rounded-full bg-slate-100 p-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}