"use client";

import { useState } from "react";

import AdmissionTable from "./AdmissionTable";
import type { AdmissionStudent } from "@/services/admissions.service";
import type { AdmissionRegisterData } from "@/services/admissions.service";

interface AdmissionDashboardProps {
  data: AdmissionRegisterData;
}

export default function AdmissionDashboard({
  data,
}: AdmissionDashboardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((item) => item !== id),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(
      checked ? data.students.map((student) => String(student.id)) : [],
    );
  };

  const handleView = (admission: AdmissionStudent) => {
    console.log("View admission:", admission.id);
  };

  const handleEdit = (admission: AdmissionStudent) => {
    console.log("Edit admission:", admission.id);
  };

  return (
    <div className="space-y-6">
      <AdmissionTable
        admissions={data.students}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onView={handleView}
        onEdit={handleEdit}
      />
    </div>
  );
}