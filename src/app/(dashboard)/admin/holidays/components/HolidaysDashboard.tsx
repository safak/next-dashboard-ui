"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CalendarDays } from "lucide-react";

import type { Holiday } from "@prisma/client";

import { deleteHoliday } from "../actions";

import HolidayDrawer from "./HolidayDrawer";
import HolidayDetailsDrawer from "./HolidayDetailsDrawer";
import HolidaysSummary from "./HolidaysSummary";
import HolidaysToolbar from "./HolidaysToolbar";
import EmptyHolidays from "./EmptyHolidays";
import HolidaysTable from "./HolidaysTable";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

interface HolidaysDashboardProps {
  holidays: Holiday[];
}

type HolidaySortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

type HolidayTypeFilter = "all" | "FULL" | "HALF";

type HolidayDateFilter = "all" | "upcoming" | "past";

export default function HolidaysDashboard({
  holidays,
}: HolidaysDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<HolidaySortOption>("date-desc");

  const [typeFilter, setTypeFilter] = useState<HolidayTypeFilter>("all");

  const [dateFilter, setDateFilter] = useState<HolidayDateFilter>("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeFilterCount = [typeFilter !== "all", dateFilter !== "all"].filter(
    Boolean,
  ).length;

  const handleCreate = () => {
    setSelectedHoliday(null);
    setDrawerOpen(true);
  };

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setDrawerOpen(true);
  };

  const handleDelete = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHoliday) return;

    const result = await deleteHoliday(selectedHoliday.id);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete holiday.");
      return;
    }

    toast.success("Holiday deleted successfully.");

    setDeleteOpen(false);
    setSelectedHoliday(null);

    router.refresh();
  };

  const handleView = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setDetailsOpen(true);
  };

  const filteredHolidays = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return [...holidays]
      .filter((holiday) => {
        // Search
        if (keyword && !holiday.title.toLowerCase().includes(keyword)) {
          return false;
        }

        // Holiday duration
        if (typeFilter === "FULL" && !holiday.isFullDay) {
          return false;
        }

        if (typeFilter === "HALF" && holiday.isFullDay) {
          return false;
        }

        // Date filter
        if (dateFilter !== "all") {
          const holidayDate = new Date(holiday.date);

          const holidayDay = new Date(
            holidayDate.getFullYear(),
            holidayDate.getMonth(),
            holidayDate.getDate(),
          );

          if (dateFilter === "upcoming" && holidayDay < today) {
            return false;
          }

          if (dateFilter === "past" && holidayDay >= today) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date-desc":
            return new Date(b.date).getTime() - new Date(a.date).getTime();

          case "date-asc":
            return new Date(a.date).getTime() - new Date(b.date).getTime();

          case "title-asc":
            return a.title.localeCompare(b.title);

          case "title-desc":
            return b.title.localeCompare(a.title);

          default:
            return 0;
        }
      });
  }, [holidays, search, sortBy, typeFilter, dateFilter]);

  const totalRecords = filteredHolidays.length;

  const paginatedHolidays = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredHolidays.slice(start, start + pageSize);
  }, [filteredHolidays, page, pageSize]);

  // Reset page when search / sort / filters change
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, typeFilter, dateFilter]);

  // Keep page within valid range
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const summary = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const tomorrowStart = new Date(todayStart);

    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const total = holidays.length;

    const fullDay = holidays.filter((holiday) => holiday.isFullDay).length;

    const halfDay = holidays.filter((holiday) => !holiday.isFullDay).length;

    const upcoming = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);

      const holidayDay = new Date(
        holidayDate.getFullYear(),
        holidayDate.getMonth(),
        holidayDate.getDate(),
      );

      return holidayDay >= todayStart;
    }).length;

    const today = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);

      return holidayDate >= todayStart && holidayDate < tomorrowStart;
    }).length;

    return {
      total,
      fullDay,
      halfDay,
      upcoming,
      today,
    };
  }, [holidays]);

  const resetFilters = () => {
    setTypeFilter("all");
    setDateFilter("all");
  };

  const initialHolidayData = selectedHoliday
    ? {
        id: selectedHoliday.id,
        title: selectedHoliday.title,
        date: new Date(selectedHoliday.date),
        isFullDay: selectedHoliday.isFullDay
          ? ("FULL" as const)
          : ("HALF" as const),
      }
    : undefined;

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}

      <PageHeader
        title="Holidays"
        subtitle="Create, schedule and manage school holidays."
        image="/holiday-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* SUMMARY CARDS */}

      <HolidaysSummary
        summary={{
          total: summary.total,
          fullDay: summary.fullDay,
          halfDay: summary.halfDay,
          upcoming: summary.upcoming,
        }}
      />

      {/* CREATE / EDIT DRAWER */}

      <HolidayDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={selectedHoliday ? "edit" : "create"}
        initialData={initialHolidayData}
      />

      {/* VIEW HOLIDAY DETAILS */}

      <HolidayDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        holiday={selectedHoliday}
      />

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Holiday?"
        description={
          selectedHoliday ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedHoliday.title}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Holiday"
        cancelText="Keep Holiday"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a holiday being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      {/* TOOLBAR */}

      <HolidaysToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sortBy}
        onSortChange={setSortBy}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        activeFilterCount={activeFilterCount}
        onResetFilters={resetFilters}
        filteredCount={totalRecords}
        totalCount={holidays.length}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
      />

      {/* HOLIDAYS */}

      {filteredHolidays.length === 0 ? (
        <EmptyHolidays
          search={search}
          hasActiveFilters={activeFilterCount > 0}
        />
      ) : (
        <>
          <HolidaysTable
            holidays={paginatedHolidays}
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
