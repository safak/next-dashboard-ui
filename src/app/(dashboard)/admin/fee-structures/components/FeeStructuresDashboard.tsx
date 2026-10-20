"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ReceiptText } from "lucide-react";

import { deleteFeeStructure } from "@/lib/actions";

import FeeStructureDrawer from "./FeeStructureDrawer";
import FeeStructuresSummary from "./FeeStructuresSummary";
import FeeStructuresToolbar from "./FeeStructuresToolbar";
import EmptyFeeStructures from "./EmptyFeeStructures";
import FeeStructuresTable from "./FeeStructuresTable";
import FeeStructureDetailsDrawer from "./FeeStructureDetailsDrawer";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";
import { SelectOption } from "@/components/ui/form/FormSelect";

export interface FeeStructureRow {
  id: number;
  classId: number;
  title: string;
  annualFee: number;
  admissionFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  class: {
    id: number;
    name: string;
  };
}

interface FeeStructuresDashboardProps {
  feeStructures: FeeStructureRow[];
  classOptions: SelectOption[];
  summary: {
    totalStructures: number;
    activeStructures: number;
    inactiveStructures: number;
    classesConfigured: number;
  };
}

export default function FeeStructuresDashboard({
  feeStructures,
  classOptions,
  summary,
}: FeeStructuresDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedFeeStructure, setSelectedFeeStructure] =
    useState<FeeStructureRow | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("class-asc");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeFilterCount = [statusFilter !== "all"].filter(Boolean).length;

  const handleCreate = () => {
    setSelectedFeeStructure(null);
    setDrawerOpen(true);
  };

  const handleEdit = (feeStructure: FeeStructureRow) => {
    setSelectedFeeStructure(feeStructure);
    setDrawerOpen(true);
  };

  const handleDelete = (feeStructure: FeeStructureRow) => {
    setSelectedFeeStructure(feeStructure);
    setDeleteOpen(true);
  };

  const handleView = (feeStructure: FeeStructureRow) => {
    setSelectedFeeStructure(feeStructure);
    setDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFeeStructure) return;

    const formData = new FormData();
    formData.append("id", String(selectedFeeStructure.id));

    const result = await deleteFeeStructure({ success: false }, formData);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete fee structure.");
      return;
    }

    toast.success("Fee structure deleted successfully.");

    setDeleteOpen(false);
    setSelectedFeeStructure(null);

    router.refresh();
  };

  const filteredFeeStructures = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...feeStructures]
      .filter((fee) => {
        if (keyword) {
          const title = fee.title.toLowerCase();
          const className = fee.class.name.toLowerCase();

          if (!title.includes(keyword) && !className.includes(keyword)) {
            return false;
          }
        }

        if (statusFilter === "active" && !fee.isActive) {
          return false;
        }

        if (statusFilter === "inactive" && fee.isActive) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "class-asc":
            return a.class.name.localeCompare(b.class.name);

          case "class-desc":
            return b.class.name.localeCompare(a.class.name);

          case "fee-high":
            return Number(b.annualFee) - Number(a.annualFee);

          case "fee-low":
            return Number(a.annualFee) - Number(b.annualFee);

          case "newest":
            return b.id - a.id;

          case "oldest":
            return a.id - b.id;

          default:
            return 0;
        }
      });
  }, [feeStructures, search, sortBy, statusFilter]);

  const totalRecords = filteredFeeStructures.length;

  const paginatedFeeStructures = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredFeeStructures.slice(start, start + pageSize);
  }, [filteredFeeStructures, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, statusFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fee Structures"
        subtitle="Manage annual fee structures for all school classes."
        image="/feestructure-icon.png"
        imageClassName="h-10 w-10"
      />

      <FeeStructuresSummary summary={summary} />

      <FeeStructureDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={selectedFeeStructure ? "edit" : "create"}
        classOptions={classOptions}
        initialData={
          selectedFeeStructure
            ? {
                id: selectedFeeStructure.id,
                classId: selectedFeeStructure.classId,
                title: selectedFeeStructure.title,
                annualFee: Number(selectedFeeStructure.annualFee),
                admissionFee: Number(selectedFeeStructure.admissionFee),
                isActive: selectedFeeStructure.isActive,
              }
            : undefined
        }
      />

      <FeeStructureDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        feeStructure={selectedFeeStructure}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Fee Structure?"
        description={
          selectedFeeStructure ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedFeeStructure.title}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Fee Structure"
        cancelText="Keep Fee Structure"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a fee structure being deleted"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      <FeeStructuresToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
        activeFilterCount={activeFilterCount}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {filteredFeeStructures.length === 0 ? (
        <EmptyFeeStructures
          onCreate={handleCreate}
          search={search}
          hasActiveFilters={statusFilter !== "all"}
        />
      ) : (
        <>
          <FeeStructuresTable
            feeStructures={paginatedFeeStructures}
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
    </div>
  );
}
