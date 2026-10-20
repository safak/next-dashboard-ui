"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { PaymentMode } from "@prisma/client";

import { deletePayment } from "../actions";

import type { PaymentWithRelations } from "../types";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

import PaymentsSummary from "./PaymentsSummary";
import PaymentsToolbar from "./PaymentsToolbar";
import PaymentsFiltersDrawer from "./PaymentsFiltersDrawer";
import PaymentsTable from "./PaymentsTable";
import PaymentDrawer from "./PaymentDrawer";
import EmptyPayments from "./EmptyPayments";

interface PaymentsDashboardProps {
  payments: PaymentWithRelations[];

  studentFees: {
    id: number;
    totalAmount: number;
    paidAmount: number;
    student: {
      id: string;
      name: string;
      surname: string;
    };
  }[];
}

export default function PaymentsDashboard({
  payments,
  studentFees,
}: PaymentsDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentWithRelations | null>(null);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  const [modeFilter, setModeFilter] = useState("all");

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const activeFilterCount = modeFilter !== "all" ? 1 : 0;

  const studentFeeOptions = useMemo(
    () =>
      studentFees
        .map((fee) => {
          const outstanding = Math.max(fee.totalAmount - fee.paidAmount, 0);

          return {
            id: fee.id,
            label: `${fee.student.name} ${fee.student.surname}`,
            totalAmount: fee.totalAmount,
            paidAmount: fee.paidAmount,
            outstanding,
          };
        })
        .filter((fee) => fee.totalAmount > fee.paidAmount),
    [studentFees],
  );

  const handleCreate = () => {
    setDrawerOpen(true);
  };

  const handleDelete = (payment: PaymentWithRelations) => {
    setSelectedPayment(payment);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPayment || deleteLoading) {
      return;
    }

    try {
      setDeleteLoading(true);

      const result = await deletePayment(selectedPayment.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete payment.");
        return;
      }

      toast.success("Payment deleted successfully.");

      setDeleteOpen(false);
      setSelectedPayment(null);

      router.refresh();
    } catch (error) {
      console.error("Delete payment error:", error);

      toast.error("Failed to delete payment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredPayments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...payments]
      .filter((payment) => {
        const studentName =
          `${payment.studentFee.student.name} ${payment.studentFee.student.surname}`.toLowerCase();

        const studentId = payment.studentFee.student.id.toLowerCase();

        const referenceId = payment.referenceId?.toLowerCase() ?? "";

        const mode = payment.mode.toLowerCase();

        if (
          keyword &&
          !studentName.includes(keyword) &&
          !studentId.includes(keyword) &&
          !referenceId.includes(keyword) &&
          !mode.includes(keyword)
        ) {
          return false;
        }

        if (modeFilter !== "all" && payment.mode !== modeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "amount-high":
            return b.amount - a.amount;

          case "amount-low":
            return a.amount - b.amount;

          case "student-asc":
            return `${a.studentFee.student.name} ${a.studentFee.student.surname}`.localeCompare(
              `${b.studentFee.student.name} ${b.studentFee.student.surname}`,
            );

          case "student-desc":
            return `${b.studentFee.student.name} ${b.studentFee.student.surname}`.localeCompare(
              `${a.studentFee.student.name} ${a.studentFee.student.surname}`,
            );

          case "oldest":
            return new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime();

          case "newest":
          default:
            return new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime();
        }
      });
  }, [payments, search, sortBy, modeFilter]);

  const totalRecords = filteredPayments.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, modeFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const totalCollected = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const cashPayments = payments.filter(
    (payment) => payment.mode === PaymentMode.CASH,
  ).length;

  const digitalPayments = payments.filter(
    (payment) => payment.mode !== PaymentMode.CASH,
  ).length;

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}

      <PageHeader
        title="Payments"
        subtitle="Manage all student fee payments and collections."
        image="/payment-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* SUMMARY */}

      <PaymentsSummary
        totalPayments={payments.length}
        totalCollected={totalCollected}
        cashPayments={cashPayments}
        digitalPayments={digitalPayments}
      />

      {/* PAYMENT DRAWER */}

      <PaymentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        studentFeeOptions={studentFeeOptions}
      />

      {/* FILTER DRAWER */}

      <PaymentsFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        modeFilter={modeFilter}
        onModeFilterChange={setModeFilter}
      />

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (deleteLoading) {
            return;
          }

          setDeleteOpen(open);

          if (!open) {
            setSelectedPayment(null);
          }
        }}
        title="Delete Payment?"
        description={
          selectedPayment ? (
            <>
              You&apos;re about to permanently delete the payment of{" "}
              <span className="font-semibold text-slate-700">
                ₹{selectedPayment.amount.toLocaleString("en-IN")}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Payment"
        cancelText="Keep Payment"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a payment being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
        loading={deleteLoading}
      />

      {/* TOOLBAR */}

      <PaymentsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        activeFilterCount={activeFilterCount}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      {/* TABLE / EMPTY */}

      {filteredPayments.length === 0 ? (
        <EmptyPayments
          search={search}
          hasActiveFilters={activeFilterCount > 0}
        />
      ) : (
        <>
          <PaymentsTable payments={paginatedPayments} onDelete={handleDelete} />

          <TablePagination
            page={page}
            pageSize={pageSize}
            total={totalRecords}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
