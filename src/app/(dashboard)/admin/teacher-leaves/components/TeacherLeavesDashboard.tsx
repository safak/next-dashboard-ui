"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PageHeader from "@/components/admin/PageHeader";
import LoadingState from "@/components/admin/LoadingState";
import EmptyState from "@/components/admin/EmptyState";
import DataTable from "@/components/admin/DataTable";
import TablePagination from "@/components/ui/TablePagination";
import EmptyTeacherLeaves from "./EmptyTeacherLeaves";
import TeacherLeavesToolbar from "./TeacherLeavesToolbar";
import LeaveSummary from "./LeaveSummary";
import LeaveColumns from "./LeaveColumns";
import LeaveBottomSheet from "./LeaveBottomSheet";
import RejectBottomSheet from "./RejectBottomSheet";

interface Summary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

export interface Leave {
  id: number;
  teacherId: string;
  teacherName: string;
  teacherImage: string | null;
  phone: string | null;
  email: string | null;
  leaveDate: string;
  leaveType: string;
  duration: string;
  reason: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
}

export default function TeacherLeavesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("date-desc");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("ALL");
  const [durationFilter, setDurationFilter] = useState("ALL");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [showLeaveSheet, setShowLeaveSheet] = useState(false);
  const [showRejectSheet, setShowRejectSheet] = useState(false);

  const loadLeaves = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/teachers/leaves", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teacher leaves");
      }

      const data = await response.json();

      setSummary(data.summary ?? null);
      setLeaves(data.leaves ?? []);
    } catch (error) {
      console.error("Failed to load teacher leaves:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const filteredLeaves = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = leaves.filter((leave) => {
      const matchesSearch =
        !keyword ||
        leave.teacherName.toLowerCase().includes(keyword) ||
        leave.leaveType.toLowerCase().includes(keyword) ||
        leave.status.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || leave.status === statusFilter;

      const matchesLeaveType =
        leaveTypeFilter === "ALL" || leave.leaveType === leaveTypeFilter;

      const matchesDuration =
        durationFilter === "ALL" || leave.duration === durationFilter;

      return (
        matchesSearch && matchesStatus && matchesLeaveType && matchesDuration
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return (
            new Date(a.leaveDate).getTime() - new Date(b.leaveDate).getTime()
          );

        case "date-desc":
          return (
            new Date(b.leaveDate).getTime() - new Date(a.leaveDate).getTime()
          );

        case "teacher-asc":
          return a.teacherName.localeCompare(b.teacherName);

        case "teacher-desc":
          return b.teacherName.localeCompare(a.teacherName);

        case "leaveType-asc":
          return a.leaveType.localeCompare(b.leaveType);

        case "leaveType-desc":
          return b.leaveType.localeCompare(a.leaveType);

        case "status-asc":
          return a.status.localeCompare(b.status);

        case "status-desc":
          return b.status.localeCompare(a.status);

        default:
          return 0;
      }
    });
  }, [leaves, search, sortBy, statusFilter, leaveTypeFilter, durationFilter]);

  const totalRecords = filteredLeaves.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedLeaves = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredLeaves.slice(start, start + pageSize);
  }, [filteredLeaves, page, pageSize]);

  const activeFilterCount =
    Number(statusFilter !== "ALL") +
    Number(leaveTypeFilter !== "ALL") +
    Number(durationFilter !== "ALL");

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, statusFilter, leaveTypeFilter, durationFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleView = (leave: Leave) => {
    setSelectedLeave(leave);
    setShowLeaveSheet(true);
  };

  const handleCloseLeaveSheet = () => {
    setShowLeaveSheet(false);
    setSelectedLeave(null);
  };

  const handleReject = () => {
    setShowLeaveSheet(false);
    setShowRejectSheet(true);
  };

  const handleCloseRejectSheet = () => {
    setShowRejectSheet(false);
    setSelectedLeave(null);
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    const leaveId = searchParams.get("leaveId");

    if (!leaveId) {
      return;
    }

    const leave = leaves.find((item) => item.id === Number(leaveId));

    if (!leave) {
      return;
    }

    setSelectedLeave(leave);
    setShowLeaveSheet(true);

    router.replace("/admin/teacher-leaves");
  }, [loading, leaves, searchParams, router]);

  if (loading) {
    return <LoadingState cards={5} rows={6} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teacher Leave Requests"
        subtitle="Review and manage teacher leave requests"
        image="/teacherLeaves-icon.png"
        imageClassName="h-10 w-10"
      />

      <LeaveSummary summary={summary} loading={loading} />

      <TeacherLeavesToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        leaveTypeFilter={leaveTypeFilter}
        onLeaveTypeFilterChange={setLeaveTypeFilter}
        durationFilter={durationFilter}
        onDurationFilterChange={setDurationFilter}
        total={totalRecords}
        onRefresh={loadLeaves}
        activeFilterCount={activeFilterCount}
      />

      {filteredLeaves.length === 0 ? (
        <EmptyTeacherLeaves
          search={search}
          hasActiveFilters={activeFilterCount > 0}
        />
      ) : (
        <>
          <DataTable
            columns={LeaveColumns({
              onView: handleView,
            })}
            data={paginatedLeaves}
            rowKey={(leave) => leave.id}
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

      <LeaveBottomSheet
        open={showLeaveSheet}
        leave={selectedLeave}
        onClose={handleCloseLeaveSheet}
        onReject={handleReject}
        onSuccess={loadLeaves}
      />

      <RejectBottomSheet
        open={showRejectSheet}
        leave={selectedLeave}
        onClose={handleCloseRejectSheet}
        onSuccess={loadLeaves}
      />
    </div>
  );
}
