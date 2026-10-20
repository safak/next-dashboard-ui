"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

import EditInstallmentDrawer from "./EditInstallmentDrawer";
import PaymentDrawer from "./PaymentDrawer";
import PaymentHistoryDrawer from "./PaymentHistoryDrawer";
import FeesSummary from "./FeesSummary";
import FeesToolbar from "./FeesToolbar";
import FeesTable from "./FeesTable";
import EmptyFees from "./EmptyFees";
import FeeDrawer from "./FeeDrawer";

import { deleteStudentFeePlan } from "../actions";

import type { FeeWithRelations } from "../types";

interface FeesDashboardProps {
  fees: FeeWithRelations[];

  students: {
    id: string;
    name: string;
    surname: string;
    class: {
      id: number;
      name: string;
    } | null;
  }[];

  classes: {
    id: number;
    name: string;
  }[];

  academicYears: {
    id: number;
    label: string;
  }[];

  feeStructures: {
    id: number;
    title: string;
    annualFee: number;
    admissionFee: number;
    classId: number;
    isActive: boolean;
  }[];
}

function getInstallmentLabel(installment: FeeWithRelations["installment"]) {
  switch (installment) {
    case "ADMISSION":
      return "Admission Fee";

    case "TERM_1":
      return "Term 1";

    case "TERM_2":
      return "Term 2";

    default:
      return installment;
  }
}

function getStatusLabel(status: FeeWithRelations["status"]) {
  switch (status) {
    case "PAID":
      return "Paid";

    case "PARTIAL":
      return "Partial";

    case "PENDING":
      return "Pending";

    default:
      return status;
  }
}

export default function FeesDashboard({
  fees,
  students,
  classes,
  academicYears,
  feeStructures,
}: FeesDashboardProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("due-date");

  const [classFilter, setClassFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [installmentFilter, setInstallmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeStructureFilter, setFeeStructureFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedFee, setSelectedFee] = useState<FeeWithRelations | null>(null);

  const [editInstallmentFee, setEditInstallmentFee] =
    useState<FeeWithRelations | null>(null);

  const [paymentFee, setPaymentFee] = useState<FeeWithRelations | null>(null);

  const [historyFee, setHistoryFee] = useState<FeeWithRelations | null>(null);

  const [deleteFee, setDeleteFee] = useState<FeeWithRelations | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const openPayment = (fee: FeeWithRelations) => {
    setPaymentFee(fee);
  };

  const openHistory = (fee: FeeWithRelations) => {
    setHistoryFee(fee);
  };

  const openDelete = (fee: FeeWithRelations) => {
    setDeleteFee(fee);
  };

  const summary = useMemo(() => {
    let total = 0;
    let collected = 0;
    let pending = 0;
    let overdue = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    fees.forEach((fee) => {
      const totalAmount = Number(fee.totalAmount) || 0;
      const paidAmount = Number(fee.paidAmount) || 0;

      total += totalAmount;
      collected += paidAmount;

      const balance = Math.max(totalAmount - paidAmount, 0);

      if (balance <= 0) {
        return;
      }

      if (fee.dueDate) {
        const dueDate = new Date(fee.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() < today.getTime()) {
          overdue += balance;
          return;
        }
      }

      pending += balance;
    });

    return {
      total,
      collected,
      pending,
      overdue,
    };
  }, [fees]);

  const openCreate = () => {
    setSelectedFee(null);
    setDrawerOpen(true);
  };

  const openEdit = (fee: FeeWithRelations) => {
    setEditInstallmentFee(fee);
  };

  const classOptions = useMemo(
    () =>
      classes.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    [classes],
  );

  const academicYearOptions = useMemo(
    () =>
      academicYears.map((item) => ({
        value: String(item.id),
        label: item.label,
      })),
    [academicYears],
  );

  const studentOptions = useMemo(
    () =>
      [...students]
        .map((student) => ({
          value: student.id,
          label: `${student.name} ${student.surname}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [students],
  );

  const feeStructureOptions = useMemo(
    () =>
      [...feeStructures]
        .map((item) => ({
          value: String(item.id),
          label: item.title,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [feeStructures],
  );

  const activeFilterCount = [
    classFilter,
    academicYearFilter,
    studentFilter,
    installmentFilter,
    statusFilter,
    feeStructureFilter,
  ].filter((value) => value !== "all").length;

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = fees.filter((fee) => {
      if (classFilter !== "all") {
        if (String(fee.student.class?.id ?? "") !== classFilter) {
          return false;
        }
      }

      if (academicYearFilter !== "all") {
        if (String(fee.plan?.academicYear?.id ?? "") !== academicYearFilter) {
          return false;
        }
      }

      if (studentFilter !== "all") {
        if (fee.student.id !== studentFilter) {
          return false;
        }
      }

      if (installmentFilter !== "all") {
        if (fee.installment !== installmentFilter) {
          return false;
        }
      }

      if (statusFilter !== "all") {
        if (fee.status !== statusFilter) {
          return false;
        }
      }

      if (feeStructureFilter !== "all") {
        if (String(fee.plan?.feeStructure?.id ?? "") !== feeStructureFilter) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      const studentName =
        `${fee.student.name} ${fee.student.surname}`.toLowerCase();

      const studentId = fee.student.id.toLowerCase();

      const className = fee.student.class?.name.toLowerCase() ?? "";

      const feeTitle = fee.plan?.feeStructure?.title?.toLowerCase() ?? "";

      const installment = getInstallmentLabel(fee.installment).toLowerCase();

      const academicYear = fee.plan?.academicYear?.label.toLowerCase() ?? "";

      const status = getStatusLabel(fee.status).toLowerCase();

      return (
        studentName.includes(query) ||
        studentId.includes(query) ||
        className.includes(query) ||
        feeTitle.includes(query) ||
        installment.includes(query) ||
        academicYear.includes(query) ||
        status.includes(query)
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "student-asc":
          return `${a.student.name} ${a.student.surname}`.localeCompare(
            `${b.student.name} ${b.student.surname}`,
          );

        case "student-desc":
          return `${b.student.name} ${b.student.surname}`.localeCompare(
            `${a.student.name} ${a.student.surname}`,
          );

        case "installment": {
          const installmentA = getInstallmentLabel(a.installment);

          const installmentB = getInstallmentLabel(b.installment);

          return installmentA.localeCompare(installmentB);
        }

        case "amount-high":
          return Number(b.totalAmount) - Number(a.totalAmount);

        case "amount-low":
          return Number(a.totalAmount) - Number(b.totalAmount);

        case "paid-high":
          return Number(b.paidAmount) - Number(a.paidAmount);

        case "balance-high": {
          const balanceA = Math.max(
            Number(a.totalAmount) - Number(a.paidAmount),
            0,
          );

          const balanceB = Math.max(
            Number(b.totalAmount) - Number(b.paidAmount),
            0,
          );

          return balanceB - balanceA;
        }

        case "balance-low": {
          const balanceA = Math.max(
            Number(a.totalAmount) - Number(a.paidAmount),
            0,
          );

          const balanceB = Math.max(
            Number(b.totalAmount) - Number(b.paidAmount),
            0,
          );

          return balanceA - balanceB;
        }

        case "due-date": {
          const dateA = a.dueDate
            ? new Date(a.dueDate).getTime()
            : Number.MAX_SAFE_INTEGER;

          const dateB = b.dueDate
            ? new Date(b.dueDate).getTime()
            : Number.MAX_SAFE_INTEGER;

          return dateA - dateB;
        }

        case "due-date-latest": {
          const dateA = a.dueDate
            ? new Date(a.dueDate).getTime()
            : Number.MIN_SAFE_INTEGER;

          const dateB = b.dueDate
            ? new Date(b.dueDate).getTime()
            : Number.MIN_SAFE_INTEGER;

          return dateB - dateA;
        }

        case "status": {
          const statusA = getStatusLabel(a.status);
          const statusB = getStatusLabel(b.status);

          return statusA.localeCompare(statusB);
        }

        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        default:
          return 0;
      }
    });
  }, [
    fees,
    search,
    sortBy,
    classFilter,
    academicYearFilter,
    studentFilter,
    installmentFilter,
    statusFilter,
    feeStructureFilter,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    sortBy,
    classFilter,
    academicYearFilter,
    studentFilter,
    installmentFilter,
    statusFilter,
    feeStructureFilter,
  ]);

  const totalFees = filteredFees.length;

  const totalPages = Math.max(1, Math.ceil(totalFees / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedFees = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredFees.slice(start, start + pageSize);
  }, [filteredFees, page, pageSize]);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteFee) {
      return;
    }

    if (!deleteFee.plan?.id) {
      toast.error("Fee plan information is missing.");
      return;
    }

    setDeleteLoading(true);

    try {
      const result = await deleteStudentFeePlan(deleteFee.plan.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete fee plan.");
        return;
      }

      toast.success("Student fee plan deleted successfully.");

      setDeleteFee(null);

      router.refresh();
    } catch (error) {
      console.error("Delete student fee plan error:", error);

      toast.error("Failed to delete fee plan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <PageHeader
          title="Fee Management"
          subtitle="Manage student fee plans, installments, payments, and outstanding balances."
          image="/feemanagement-icon.png"
          imageClassName="h-10 w-10"
        />

        <FeesSummary
          total={summary.total}
          collected={summary.collected}
          pending={summary.pending}
          overdue={summary.overdue}
        />

        <FeesToolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          total={totalFees}
          onCreate={openCreate}
          onRefresh={handleRefresh}
          activeFilterCount={activeFilterCount}
          classFilter={classFilter}
          onClassFilterChange={setClassFilter}
          academicYearFilter={academicYearFilter}
          onAcademicYearFilterChange={setAcademicYearFilter}
          studentFilter={studentFilter}
          onStudentFilterChange={setStudentFilter}
          installmentFilter={installmentFilter}
          onInstallmentFilterChange={setInstallmentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          feeStructureFilter={feeStructureFilter}
          onFeeStructureFilterChange={setFeeStructureFilter}
          classOptions={classOptions}
          academicYearOptions={academicYearOptions}
          studentOptions={studentOptions}
          feeStructureOptions={feeStructureOptions}
        />

        {filteredFees.length === 0 ? (
          <EmptyFees search={search} hasActiveFilters={activeFilterCount > 0} />
        ) : (
          <>
            <FeesTable
              fees={paginatedFees}
              onEdit={openEdit}
              onPayment={openPayment}
              onHistory={openHistory}
              onDelete={openDelete}
            />

            <TablePagination
              page={page}
              pageSize={pageSize}
              total={totalFees}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </div>

      <FeeDrawer
        open={drawerOpen}
        fee={selectedFee}
        students={students}
        classes={classes}
        academicYears={academicYears}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedFee(null);
        }}
      />

      <EditInstallmentDrawer
        open={Boolean(editInstallmentFee)}
        fee={editInstallmentFee}
        onClose={() => {
          setEditInstallmentFee(null);
          router.refresh();
        }}
      />

      <PaymentDrawer
        open={Boolean(paymentFee)}
        fee={paymentFee}
        onClose={() => {
          setPaymentFee(null);
          router.refresh();
        }}
      />

      <PaymentHistoryDrawer
        open={Boolean(historyFee)}
        fee={historyFee}
        onClose={() => setHistoryFee(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteFee)}
        title="Delete Student Fee Plan"
        message={
          deleteFee
            ? `Are you sure you want to delete the complete fee plan for "${deleteFee.student.name} ${deleteFee.student.surname}"? This will remove the Admission Fee, Term 1 Fee, and Term 2 Fee. This action cannot be undone.`
            : ""
        }
        confirmText="Delete Plan"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          if (deleteLoading) {
            return;
          }

          setDeleteFee(null);
        }}
      />
    </>
  );
}
