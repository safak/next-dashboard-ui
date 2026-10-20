"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AdmissionSummary from "./AdmissionSummary";
import AdmissionToolbar from "./AdmissionToolbar";
import AdmissionTable from "./AdmissionTable";
import AdmissionFiltersDrawer from "./AdmissionFiltersDrawer";
import EmptyAdmissions from "./EmptyAdmissions";

import type {
  AdmissionRegisterSummary,
  AdmissionStudent,
} from "@/services/admissions.service";

interface Props {
  students: AdmissionStudent[];

  summary: AdmissionRegisterSummary;

  classes: {
    id: number;
    name: string;
  }[];

  academicYear: {
    id: number;
    label: string;
  } | null;
}

export default function AdmissionManagementContent({
  students,
  summary,
  classes,
  academicYear,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    classId: "",
    academicYear: "",
  });

  const filteredAdmissions = useMemo(() => {
    let data = [...students];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter(
        (student) =>
          student.studentName.toLowerCase().includes(query) ||
          student.admissionNo.toLowerCase().includes(query) ||
          student.parentName.toLowerCase().includes(query),
      );
    }

    // Status
    if (filters.status && filters.status !== "all") {
      data = data.filter((student) => student.status === filters.status);
    }

    // Class
    if (filters.classId && filters.classId !== "all") {
      data = data.filter(
        (student) => String(student.classId) === filters.classId,
      );
    }

    // Sorting
    switch (sortBy) {
      case "name-asc":
        data.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;

      case "name-desc":
        data.sort((a, b) => b.studentName.localeCompare(a.studentName));
        break;

      case "admission":
        data.sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
        break;

      case "newest":
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      case "oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
    }

    return data;
  }, [students, search, filters, sortBy]);

  const activeFilterCount = [filters.status, filters.classId].filter(
    (value) => value !== "all",
  ).length;

  return (
    <div className="space-y-6">
      <AdmissionSummary summary={summary} />

      <AdmissionToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={filteredAdmissions.length}
        activeFilterCount={activeFilterCount}
        onRefresh={() => window.location.reload()}
        onExport={() => {
          // TODO
        }}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      {filteredAdmissions.length === 0 ? (
        <EmptyAdmissions />
      ) : (
        <AdmissionTable
          admissions={filteredAdmissions}
          selectedIds={selectedIds}
          onSelect={(id, checked) => {
            setSelectedIds((prev) =>
              checked ? [...prev, id] : prev.filter((x) => x !== id),
            );
          }}
          onSelectAll={(checked) =>
            setSelectedIds(
              checked ? filteredAdmissions.map((s) => String(s.id)) : [],
            )
          }
          onView={(student) =>
            router.push(`/admin/students/admissions/${student.id}`)
          }
          onEdit={(student) =>
            router.push(`/admin/students/admissions/${student.id}/edit`)
          }
        />
      )}

      <AdmissionFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
        classes={classes}
        academicYears={academicYear ? [academicYear.label] : []}
      />
    </div>
  );
}
