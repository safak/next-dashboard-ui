"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CalendarDays } from "lucide-react";

import { deleteEvent } from "../actions";

import EventDrawer from "./EventDrawer";
import EventsSummary from "./EventsSummary";
import EventsToolbar from "./EventsToolbar";
import EmptyEvents from "./EmptyEvents";
import EventsTable from "./EventsTable";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

import type { ClassOption, EventRow } from "../types";
import type { EventFormValues } from "../schema";

interface EventsDashboardProps {
  events: EventRow[];
  classes: ClassOption[];
}

export default function EventsDashboard({
  events,
  classes,
}: EventsDashboardProps) {
  const router = useRouter();

  // ==================================================
  // Drawer / Dialog State
  // ==================================================

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);

  // ==================================================
  // Search / Sort State
  // ==================================================

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // ==================================================
  // Filter State
  // ==================================================

  const [classFilter, setClassFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ==================================================
  // Pagination State
  // ==================================================

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ==================================================
  // Active Filter Count
  // ==================================================

  const activeFilterCount = [
    classFilter !== "all",
    categoryFilter !== "all",
  ].filter(Boolean).length;

  // ==================================================
  // Create
  // ==================================================

  const handleCreate = () => {
    setSelectedEvent(null);
    setDrawerOpen(true);
  };

  // ==================================================
  // Edit
  // ==================================================

  const handleEdit = (event: EventRow) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  // ==================================================
  // Delete
  // ==================================================

  const handleDelete = (event: EventRow) => {
    setSelectedEvent(event);
    setDeleteOpen(true);
  };

  // ==================================================
  // Confirm Delete
  // ==================================================

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    const result = await deleteEvent(selectedEvent.id);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete event.");
      return;
    }

    toast.success("Event deleted successfully.");

    setDeleteOpen(false);
    setSelectedEvent(null);

    router.refresh();
  };

  // ==================================================
  // Filter + Search + Sort
  // ==================================================

  const filteredEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...events]
      .filter((event) => {
        // ------------------------------------------------
        // Search
        // ------------------------------------------------

        if (keyword) {
          const matchesSearch =
            event.title.toLowerCase().includes(keyword) ||
            event.description.toLowerCase().includes(keyword) ||
            (event.category ?? "").toLowerCase().includes(keyword) ||
            (event.class?.name ?? "").toLowerCase().includes(keyword);

          if (!matchesSearch) {
            return false;
          }
        }

        // ------------------------------------------------
        // Class Filter
        // ------------------------------------------------

        if (classFilter !== "all" && String(event.classId) !== classFilter) {
          return false;
        }

        // ------------------------------------------------
        // Category Filter
        // ------------------------------------------------

        if (
          categoryFilter !== "all" &&
          (event.category ?? "") !== categoryFilter
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date-desc":
            return (
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
            );

          case "date-asc":
            return (
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );

          case "title-asc":
            return a.title.localeCompare(b.title);

          case "title-desc":
            return b.title.localeCompare(a.title);

          case "category-asc":
            return (a.category ?? "").localeCompare(b.category ?? "");

          case "category-desc":
            return (b.category ?? "").localeCompare(a.category ?? "");

          default:
            return 0;
        }
      });
  }, [events, search, sortBy, classFilter, categoryFilter]);

  const totalRecords = filteredEvents.length;

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, classFilter, categoryFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const now = new Date();

  const upcoming = events.filter(
    (event) => new Date(event.startTime) > now,
  ).length;

  const today = events.filter((event) => {
    const date = new Date(event.startTime);
    const current = new Date();

    return (
      date.getFullYear() === current.getFullYear() &&
      date.getMonth() === current.getMonth() &&
      date.getDate() === current.getDate()
    );
  }).length;

  const categories = new Set(
    events.map((event) => event.category).filter(Boolean),
  ).size;

  const resetFilters = () => {
    setClassFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  const initialEventData: EventFormValues | undefined = selectedEvent
    ? {
        id: selectedEvent.id,
        title: selectedEvent.title,
        description: selectedEvent.description,
        startTime: new Date(selectedEvent.startTime),
        endTime: new Date(selectedEvent.endTime),
        classId: selectedEvent.classId,
        category: selectedEvent.category ?? undefined,
      }
    : undefined;

  return (
    <div className="space-y-4">

      <PageHeader
        title="Events"
        subtitle="Create, schedule and manage school events."
        image="/event-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <EventsSummary
        total={events.length}
        upcoming={upcoming}
        today={today}
        categories={categories}
      />

      {/* ==================================================
          CREATE / EDIT DRAWER
      ================================================== */}

      <EventDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);

          if (!open) {
            setSelectedEvent(null);
          }
        }}
        classes={classes}
        mode={selectedEvent ? "edit" : "create"}
        initialData={initialEventData}
      />

      {/* ==================================================
          DELETE CONFIRMATION
      ================================================== */}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Event?"
        description={
          selectedEvent ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedEvent.title}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Event"
        cancelText="Keep Event"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing an event being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <EventsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
        activeFilterCount={activeFilterCount}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        classes={classes}
        onResetFilters={resetFilters}
      />

      {/* ==================================================
          EVENTS
      ================================================== */}

      {filteredEvents.length === 0 ? (
        <EmptyEvents
          search={search}
          hasActiveFilters={classFilter !== "all" || categoryFilter !== "all"}
        />
      ) : (
        <>
          <EventsTable
            events={paginatedEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
