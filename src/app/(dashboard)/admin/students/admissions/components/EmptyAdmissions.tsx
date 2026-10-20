"use client";

import { ClipboardList } from "lucide-react";

interface EmptyAdmissionsProps {
  title?: string;
  description?: string;
}

export default function EmptyAdmissions({
  title = "No Admissions Yet",
  description = "There are no admission applications yet. Use the 'New Admission' button above to create the first admission.",
}: EmptyAdmissionsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-20 text-center shadow-sm">
      <div className="mb-5 rounded-full bg-sky-100 p-5">
        <ClipboardList className="h-10 w-10 text-sky-600" />
      </div>

      <h2 className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}