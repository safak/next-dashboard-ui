"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

import { deleteStudent } from "@/lib/actions";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

import AdmissionDetailsDrawer from "./AdmissionDetailsDrawer";
import AdmissionsSummary from "./AdmissionsSummary";
import AdmissionsTable from "./AdmissionsTable";
import AdmissionsToolbar from "./AdmissionsToolbar";
import EmptyAdmissions from "./EmptyAdmissions";

import type { AdmissionRow } from "./types";

interface AdmissionsDashboardProps {
  admissions: AdmissionRow[];

  academicYearOptions: {
    value: string;
    label: string;
  }[];

  classOptions: {
    value: string;
    label: string;
  }[];

  summary: {
    totalAdmissions: number;
    thisYearAdmissions: number;
    activeStudents: number;
    feesDue: number;
  };
}

export default function AdmissionsDashboard({
  admissions,
  academicYearOptions,
  classOptions,
  summary,
}: AdmissionsDashboardProps) {
  const router = useRouter();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAdmission, setSelectedAdmission] =
    useState<AdmissionRow | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("admission-newest");

  const [academicYearFilter, setAcademicYearFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeStatusFilter, setFeeStatusFilter] = useState("all");
  const [documentFilter, setDocumentFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeFilterCount = [
    academicYearFilter !== "all",
    classFilter !== "all",
    statusFilter !== "all",
    feeStatusFilter !== "all",
    documentFilter !== "all",
  ].filter(Boolean).length;

  const filteredAdmissions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return admissions
      .filter((admission) => {
        if (keyword) {
          const studentName =
            `${admission.name} ${admission.surname}`.toLowerCase();

          const parentName = admission.parent
            ? `${admission.parent.name} ${admission.parent.surname}`.toLowerCase()
            : "";

          const matchesSearch =
            studentName.includes(keyword) ||
            admission.admissionNo?.toLowerCase().includes(keyword) ||
            String(admission.rollNo).toLowerCase().includes(keyword) ||
            admission.phone?.toLowerCase().includes(keyword) ||
            admission.email?.toLowerCase().includes(keyword) ||
            parentName.includes(keyword) ||
            admission.class?.name?.toLowerCase().includes(keyword);

          if (!matchesSearch) {
            return false;
          }
        }

        if (
          academicYearFilter !== "all" &&
          String(admission.academicYear?.id) !== academicYearFilter
        ) {
          return false;
        }

        if (
          classFilter !== "all" &&
          String(admission.class?.id) !== classFilter
        ) {
          return false;
        }

        if (statusFilter !== "all" && admission.status !== statusFilter) {
          return false;
        }

        if (feeStatusFilter !== "all") {
          const hasFeeStatus = admission.studentFees.some(
            (fee) => fee.status === feeStatusFilter,
          );

          if (!hasFeeStatus) {
            return false;
          }
        }

        if (documentFilter !== "all") {
          const documentCount = admission.studentDocuments?.length ?? 0;

          if (documentFilter === "uploaded" && documentCount === 0) {
            return false;
          }

          if (documentFilter === "missing" && documentCount > 0) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return `${a.name} ${a.surname}`.localeCompare(
              `${b.name} ${b.surname}`,
            );

          case "name-desc":
            return `${b.name} ${b.surname}`.localeCompare(
              `${a.name} ${a.surname}`,
            );

          case "admission-no":
            return a.admissionNo.localeCompare(b.admissionNo);

          case "class":
            return (a.class?.name ?? "").localeCompare(b.class?.name ?? "");

          case "fee-high":
            return getFeeDue(b) - getFeeDue(a);

          case "fee-low":
            return getFeeDue(a) - getFeeDue(b);

          case "admission-oldest":
            return (
              new Date(a.admissionDate).getTime() -
              new Date(b.admissionDate).getTime()
            );

          case "admission-newest":
          default:
            return (
              new Date(b.admissionDate).getTime() -
              new Date(a.admissionDate).getTime()
            );
        }
      });
  }, [
    admissions,
    search,
    sortBy,
    academicYearFilter,
    classFilter,
    statusFilter,
    feeStatusFilter,
    documentFilter,
  ]);

  const totalRecords = filteredAdmissions.length;

  const paginatedAdmissions = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredAdmissions.slice(start, start + pageSize);
  }, [filteredAdmissions, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    sortBy,
    academicYearFilter,
    classFilter,
    statusFilter,
    feeStatusFilter,
    documentFilter,
  ]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const handleCreate = () => {
    router.push("/admin/admissions/new");
  };

  const handleEdit = (admission: AdmissionRow) => {
    router.push(`/admin/admissions/new?edit=${admission.id}`);
  };

  const handleView = (admission: AdmissionRow) => {
    setSelectedAdmission(admission);
    setDetailsOpen(true);
  };

  const handleDelete = (admission: AdmissionRow) => {
    setSelectedAdmission(admission);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmission) {
      return;
    }

    const formData = new FormData();

    formData.append("id", selectedAdmission.id);

    const result = await deleteStudent({ success: false }, formData);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete admission.");
      return;
    }

    toast.success("Admission deleted successfully.");

    setDeleteOpen(false);
    setSelectedAdmission(null);

    router.refresh();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Admissions"
        subtitle="Manage student admissions and enrollment records."
        image="/admissions-icon.png"
        imageClassName="h-10 w-10"
      />

      <AdmissionsSummary summary={summary} />

      <AdmissionsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onRefresh={() => router.refresh()}
        activeFilterCount={activeFilterCount}
        academicYearFilter={academicYearFilter}
        onAcademicYearFilterChange={setAcademicYearFilter}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        feeStatusFilter={feeStatusFilter}
        onFeeStatusFilterChange={setFeeStatusFilter}
        documentFilter={documentFilter}
        onDocumentFilterChange={setDocumentFilter}
        academicYearOptions={academicYearOptions}
        classOptions={classOptions}
      />

      {filteredAdmissions.length === 0 ? (
        <EmptyAdmissions
          search={search}
          hasActiveFilters={activeFilterCount > 0}
          onCreate={handleCreate}
        />
      ) : (
        <>
          <AdmissionsTable
            admissions={paginatedAdmissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />

          <TablePagination
            page={page}
            pageSize={pageSize}
            total={totalRecords}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <AdmissionDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        admission={selectedAdmission}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Admission?"
        description={
          selectedAdmission ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedAdmission.name} {selectedAdmission.surname}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Admission"
        cancelText="Keep Admission"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Delete admission confirmation"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />
    </div>
  );
}

function getFeeDue(admission: AdmissionRow) {
  return admission.studentFees.reduce(
    (total, fee) =>
      total + Math.max(Number(fee.totalAmount) - Number(fee.paidAmount), 0),
    0,
  );
}
