import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  value: ReactNode;
}

export default function InfoCard({
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="mt-2 text-lg font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}