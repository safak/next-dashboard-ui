"use client";

import { useState } from "react";
import AdmissionTable from "../components/AdmissionTable";
import type { AdmissionStudent } from "@/services/admissions.service";

interface ApplicationsTableClientProps {
  admissions: AdmissionStudent[];
}

export default function ApplicationsTableClient({
  admissions,
}: ApplicationsTableClientProps) {
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
      checked ? admissions.map((admission) => String(admission.id)) : [],
    );
  };

  const handleView = (admission: AdmissionStudent) => {
    console.log("View admission:", admission.id);
  };

  const handleEdit = (admission: AdmissionStudent) => {
    console.log("Edit admission:", admission.id);
  };

  return (
    <AdmissionTable
      admissions={admissions}
      selectedIds={selectedIds}
      onSelect={handleSelect}
      onSelectAll={handleSelectAll}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}
