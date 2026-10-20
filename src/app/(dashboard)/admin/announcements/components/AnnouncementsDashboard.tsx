"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "../actions";

import type {
  AnnouncementFormValues,
  AnnouncementPriorityFilter,
  AnnouncementRow,
  AnnouncementStatusFilter,
  ClassOption,
} from "../types";

import AnnouncementsSummary from "./AnnouncementsSummary";
import AnnouncementsToolbar from "./AnnouncementsToolbar";
import AnnouncementsTable from "./AnnouncementsTable";
import AnnouncementForm from "./AnnouncementForm";
import EmptyAnnouncements from "./EmptyAnnouncements";

interface AnnouncementsDashboardProps {
  announcements: AnnouncementRow[];
  classes: ClassOption[];
}

export default function AnnouncementsDashboard({
  announcements,
  classes,
}: AnnouncementsDashboardProps) {
  const router = useRouter();

  /* ==================================================
     Drawer / Dialog State
  ================================================== */

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementRow | null>(null);

  const [loading, setLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ==================================================
     Search / Sort State
  ================================================== */

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("date-desc");

  /* ==================================================
     Filter State
  ================================================== */

  const [classFilter, setClassFilter] = useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState<AnnouncementPriorityFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<AnnouncementStatusFilter>("all");

  /* ==================================================
     Pagination State
  ================================================== */

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  /* ==================================================
     Active Filter Count
  ================================================== */

  const activeFilterCount = [
    classFilter !== "all",
    priorityFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  /* ==================================================
     Helpers
  ================================================== */

  const isExpired = useCallback((announcement: AnnouncementRow) => {
    if (!announcement.expiryDate) {
      return false;
    }

    return new Date(announcement.expiryDate).getTime() < Date.now();
  }, []);

  const getStatus = useCallback(
    (announcement: AnnouncementRow): AnnouncementStatusFilter => {
      if (isExpired(announcement)) {
        return "expired";
      }

      if (announcement.isPublished) {
        return "published";
      }

      return "draft";
    },
    [isExpired],
  );

  /* ==================================================
     Create
  ================================================== */

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setDrawerOpen(true);
  };

  /* ==================================================
     Edit
  ================================================== */

  const handleEdit = (announcement: AnnouncementRow) => {
    setSelectedAnnouncement(announcement);
    setDrawerOpen(true);
  };

  /* ==================================================
     Delete
  ================================================== */

  const handleDelete = (announcement: AnnouncementRow) => {
    setSelectedAnnouncement(announcement);
    setDeleteOpen(true);
  };

  /* ==================================================
     Confirm Delete
  ================================================== */

  const handleDeleteConfirm = async () => {
    if (!selectedAnnouncement) {
      return;
    }

    try {
      setDeleteLoading(true);

      const formData = new FormData();

      formData.append("id", String(selectedAnnouncement.id));

      const result = await deleteAnnouncement(
        {
          success: false,
        },
        formData,
      );

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete announcement.");

        return;
      }

      toast.success(
        `Announcement "${selectedAnnouncement.title}" deleted successfully.`,
      );

      setDeleteOpen(false);

      setSelectedAnnouncement(null);

      router.refresh();
    } catch (error) {
      console.error("Delete announcement error:", error);

      toast.error("Failed to delete announcement.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ==================================================
     Create / Update
  ================================================== */

  const handleSubmit = async (values: AnnouncementFormValues) => {
    try {
      setLoading(true);

      const result = selectedAnnouncement
        ? await updateAnnouncement(
            {
              success: false,
            },
            {
              ...values,
              id: selectedAnnouncement.id,
            },
          )
        : await createAnnouncement(
            {
              success: false,
            },
            values,
          );

      if (!result.success) {
        toast.error(result.error ?? "Failed to save announcement.");
        return;
      }

      toast.success(
        result.message ??
          (selectedAnnouncement
            ? "Announcement updated successfully"
            : "Announcement created successfully"),
      );

      setDrawerOpen(false);
      setSelectedAnnouncement(null);

      router.refresh();
    } catch (error) {
      console.error("Save announcement error:", error);

      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* Reset Filters */

  const resetFilters = () => {
    setClassFilter("all");

    setPriorityFilter("all");

    setStatusFilter("all");
  };

  /* Filter / Search / Sort */

  const filteredAnnouncements = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return (
      [...announcements]
        /* Filters */
        .filter((announcement) => {
          if (
            classFilter !== "all" &&
            String(announcement.classId) !== classFilter
          ) {
            return false;
          }

          if (
            priorityFilter !== "all" &&
            announcement.priority !== priorityFilter
          ) {
            return false;
          }

          if (
            statusFilter !== "all" &&
            getStatus(announcement) !== statusFilter
          ) {
            return false;
          }

          return true;
        })

        /* -----------------------------------------------
         Search
      ------------------------------------------------ */
        .filter((announcement) => {
          if (!keyword) {
            return true;
          }

          const title = announcement.title.toLowerCase();

          const description = announcement.description.toLowerCase();

          const className = announcement.class?.name.toLowerCase() ?? "";

          const priority = announcement.priority.toLowerCase();

          const status = getStatus(announcement);

          return (
            title.includes(keyword) ||
            description.includes(keyword) ||
            className.includes(keyword) ||
            priority.includes(keyword) ||
            status.includes(keyword)
          );
        })

        /* -----------------------------------------------
         Sort
      ------------------------------------------------ */
        .sort((a, b) => {
          switch (sortBy) {
            case "date-desc":
              return (
                new Date(b.publishDate).getTime() -
                new Date(a.publishDate).getTime()
              );

            case "date-asc":
              return (
                new Date(a.publishDate).getTime() -
                new Date(b.publishDate).getTime()
              );

            case "title-asc":
              return a.title.localeCompare(b.title);

            case "title-desc":
              return b.title.localeCompare(a.title);

            case "priority-desc": {
              const priorityOrder: Record<AnnouncementRow["priority"], number> =
                {
                  LOW: 1,
                  NORMAL: 2,
                  HIGH: 3,
                  URGENT: 4,
                };

              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }

            case "priority-asc": {
              const priorityOrder: Record<AnnouncementRow["priority"], number> =
                {
                  LOW: 1,
                  NORMAL: 2,
                  HIGH: 3,
                  URGENT: 4,
                };

              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }

            default:
              return (
                new Date(b.publishDate).getTime() -
                new Date(a.publishDate).getTime()
              );
          }
        })
    );
  }, [
    announcements,
    search,
    classFilter,
    priorityFilter,
    statusFilter,
    sortBy,
    getStatus,
  ]);

  /* ==================================================
     Pagination
  ================================================== */

  const totalRecords = filteredAnnouncements.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedAnnouncements = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredAnnouncements.slice(start, start + pageSize);
  }, [filteredAnnouncements, page, pageSize]);

  /* ==================================================
     Reset Page When Search / Filter / Sort Changes
  ================================================== */

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, classFilter, priorityFilter, statusFilter]);

  /* ==================================================
     Keep Page In Bounds
  ================================================== */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* ==================================================
     Summary
  ================================================== */

  const totalPublished = announcements.filter(
    (announcement) => announcement.isPublished,
  ).length;

  const totalDrafts = announcements.filter(
    (announcement) => !announcement.isPublished,
  ).length;

  const totalUrgent = announcements.filter(
    (announcement) => announcement.priority === "URGENT",
  ).length;

  /* ==================================================
     Render
  ================================================== */

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}

      <PageHeader
        title="Announcements"
        subtitle="Create, publish and manage school announcements."
        image="/announcement-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* SUMMARY */}

      <AnnouncementsSummary
        total={announcements.length}
        published={totalPublished}
        drafts={totalDrafts}
        urgent={totalUrgent}
      />

      {/* CREATE / EDIT DRAWER */}

      <AnnouncementForm
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);

          if (!open) {
            setSelectedAnnouncement(null);
          }
        }}
        announcement={selectedAnnouncement}
        classes={classes}
        onSubmit={handleSubmit}
        loading={loading}
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
            setSelectedAnnouncement(null);
          }
        }}
        title="Delete Announcement?"
        description={
          selectedAnnouncement ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedAnnouncement.title}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Announcement"
        cancelText="Keep Announcement"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing an announcement being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
        loading={deleteLoading}
      />

      {/* TOOLBAR */}

      <AnnouncementsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        classes={classes}
        total={totalRecords}
        onRefresh={() => router.refresh()}
        onCreate={handleCreate}
        activeFilterCount={activeFilterCount}
        onResetFilters={resetFilters}
      />

      {/* ANNOUNCEMENTS */}

      {filteredAnnouncements.length === 0 ? (
        <EmptyAnnouncements
          search={search}
          hasActiveFilters={activeFilterCount > 0}
        />
      ) : (
        <>
          <AnnouncementsTable
            announcements={paginatedAnnouncements}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

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
