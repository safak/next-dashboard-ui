"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trash2, RotateCcw } from "lucide-react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StudentToolbar from "./StudentToolbar";
import StudentTable from "./StudentTable";
import StudentDrawer from "./StudentDrawer";
import EmptyStudents from "./EmptyStudents";

import { Student, StudentSummary as StudentSummaryType } from "@/types/student";
import StudentProfileSheet from "./StudentProfileSheet";
import StudentEditSheet from "./EditStudentSheet";
import StatusBadge from "@/components/admin/StatusBadge";
import StudentFiltersDrawer from "./StudentFiltersDrawer";
import StudentBulkToolbar from "./StudentBulkToolbar";
import StudentExportDialog from "./StudentExportDialog";
import TablePagination from "@/components/ui/TablePagination";

interface StudentManagementDashboardProps {
  students: Student[];
  summary: StudentSummaryType;
  archived?: boolean;
}

export default function StudentManagementDashboard({
  students,
  summary,
  archived = false,
}: StudentManagementDashboardProps) {
  const router = useRouter();

  const [studentList, setStudentList] = useState(students);

  useEffect(() => {
    setStudentList(students);
  }, [students]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkArchiveOpen, setBulkArchiveOpen] = useState(false);
  const [bulkRestoreOpen, setBulkRestoreOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [bulkLoading, setBulkLoading] = useState(false);

  const [filters, setFilters] = useState({
    className: "all",
    academicYear: "all",
    gender: "all",
    bloodType: "all",
  });

  const filteredStudents = useMemo(() => {
    return studentList.filter((student) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        !keyword ||
        student.fullName.toLowerCase().includes(keyword) ||
        student.admissionNo.toLowerCase().includes(keyword) ||
        student.rollNo.toLowerCase().includes(keyword);

      const matchesClass =
        filters.className === "all" || student.className === filters.className;

      const matchesYear =
        filters.academicYear === "all" ||
        student.academicYear === filters.academicYear;

      const matchesGender =
        filters.gender === "all" || student.gender === filters.gender;

      const matchesBlood =
        filters.bloodType === "all" || student.bloodType === filters.bloodType;

      return (
        matchesSearch &&
        matchesClass &&
        matchesYear &&
        matchesGender &&
        matchesBlood
      );
    });
  }, [studentList, search, filters]);

  const totalRecords = filteredStudents.length;

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, sortBy]);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const handleArchive = (student: Student) => {
    setSelectedStudent(student);
    setArchiveOpen(true);
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;

    try {
      setBulkLoading(true);

      const response = await fetch("/api/admin/students/archive", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: selectedIds,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      setStudentList((prev) =>
        prev.filter((student) => !selectedIds.includes(student.id)),
      );

      setSelectedIds([]);
      setBulkArchiveOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive students.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(
        `/api/admin/students/${selectedStudent.id}/archive`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      setStudentList((prev) => prev.filter((s) => s.id !== selectedStudent.id));

      setArchiveOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive student.");
    }
  };

  const handleViewStudent = (student: Student) => {
    console.log("View clicked", student);

    setSelectedStudent(student);
    setProfileOpen(true);
  };

  const handleRestore = (student: Student) => {
    setSelectedStudent(student);
    setRestoreOpen(true);
  };

  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;

    try {
      setBulkLoading(true);

      const response = await fetch("/api/admin/students/restore", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: selectedIds,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      setStudentList((prev) =>
        prev.filter((student) => !selectedIds.includes(student.id)),
      );

      setSelectedIds([]);
      setBulkRestoreOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to restore students.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handlePermanentDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setBulkLoading(true);

      const response = await fetch("/api/admin/students", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: selectedIds,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      setStudentList((prev) =>
        prev.filter((student) => !selectedIds.includes(student.id)),
      );

      setSelectedIds([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete students.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(
        `/api/admin/students/${selectedStudent.id}/delete`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      setStudentList((prev) => prev.filter((s) => s.id !== selectedStudent.id));

      setDeleteOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student.");
    }
  };

  const handleRestoreConfirm = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(
        `/api/admin/students/${selectedStudent.id}/restore`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      setStudentList((prev) => prev.filter((s) => s.id !== selectedStudent.id));

      setRestoreOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to restore student.");
    }
  };

  const handleSelect = (studentId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredStudents.map((student) => student.id));
    } else {
      setSelectedIds([]);
    }
  };

  const activeFilterCount = [
    filters.className,
    filters.academicYear,
    filters.gender,
    filters.bloodType,
  ].filter((value) => value !== "all").length;

  console.log(filters);
  console.log(activeFilterCount);

  return (
    <div className="space-y-4">
      <StudentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        student={selectedStudent}
      />

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive Student"
        description={
          selectedStudent ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Are you sure you want to archive this student?
              </p>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Student</span>
                    <span className="font-semibold text-slate-900">
                      {selectedStudent.fullName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">
                      Admission No
                    </span>
                    <span>{selectedStudent.admissionNo}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Class</span>
                    <span>{selectedStudent.className}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Status</span>
                    <span className="text-green-600 font-medium">
                      <StatusBadge status={selectedStudent.status} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  The student&apos;s academic records, attendance, fees and reports
                  will be preserved. This student can be restored at any time
                  from the <strong>Archived Students</strong> section.
                </p>
              </div>
            </div>
          ) : null
        }
        confirmText="Archive Student"
        confirmButtonClassName="bg-amber-600 hover:bg-amber-700"
        onConfirm={handleArchiveConfirm}
      />

      <ConfirmDialog
        open={bulkArchiveOpen}
        onOpenChange={setBulkArchiveOpen}
        loading={bulkLoading}
        title="Archive Students"
        confirmText={`Archive ${selectedIds.length} Student${selectedIds.length > 1 ? "s" : ""}`}
        confirmButtonClassName="bg-amber-600 hover:bg-amber-700"
        description={
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              You are about to archive
              <strong> {selectedIds.length} students</strong>.
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              Their academic records, attendance, fees and reports will remain
              محفوظ and can be restored later.
            </div>
          </div>
        }
        onConfirm={handleBulkArchive}
      />

      <ConfirmDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        title="Restore Student"
        description={
          selectedStudent ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Are you sure you want to restore this student to the active
                student list?
              </p>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Student</span>
                    <span className="font-semibold text-slate-900">
                      {selectedStudent.fullName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">
                      Admission No
                    </span>
                    <span>{selectedStudent.admissionNo}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Class</span>
                    <span>{selectedStudent.className}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Status</span>
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  This student will be restored to the active student list and
                  will once again appear in admissions, attendance, fees,
                  examinations, reports, and all other academic modules.
                </p>
              </div>
            </div>
          ) : null
        }
        confirmText="Restore Student"
        confirmButtonClassName="bg-emerald-600 hover:bg-emerald-700"
        icon={RotateCcw}
        iconClassName="text-emerald-600"
        iconBackgroundClassName="bg-emerald-100"
        onConfirm={handleRestoreConfirm}
      />

      <ConfirmDialog
        open={bulkRestoreOpen}
        onOpenChange={setBulkRestoreOpen}
        loading={bulkLoading}
        title="Restore Students"
        icon={RotateCcw}
        iconClassName="text-emerald-600"
        iconBackgroundClassName="bg-emerald-100"
        confirmText={`Restore ${selectedIds.length} Student${selectedIds.length > 1 ? "s" : ""}`}
        confirmButtonClassName="bg-emerald-600 hover:bg-emerald-700"
        description={
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Restore
              <strong> {selectedIds.length} students</strong>
              to the active student list?
            </p>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              Restored students will again appear in attendance, fees,
              examinations and reports.
            </div>
          </div>
        }
        onConfirm={handleBulkRestore}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        icon={Trash2}
        title="Delete Student Permanently"
        description={
          selectedStudent ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                This action <strong>cannot be undone.</strong>
              </p>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Student</span>

                    <span className="font-semibold">
                      {selectedStudent.fullName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">
                      Admission No
                    </span>

                    <span>{selectedStudent.admissionNo}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Class</span>

                    <span>{selectedStudent.className}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-red-300 bg-red-100 p-3">
                <p className="text-xs text-red-700">
                  Permanently deleting this student will remove the student
                  record from the system. This action cannot be reversed.
                </p>
              </div>
            </div>
          ) : null
        }
        confirmText="Delete Permanently"
        confirmButtonClassName="bg-red-600 hover:bg-red-700"
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        loading={bulkLoading}
        title="Delete Students Permanently"
        icon={Trash2}
        iconClassName="text-red-600"
        iconBackgroundClassName="bg-red-100"
        confirmText={`Delete ${selectedIds.length} Student${selectedIds.length > 1 ? "s" : ""}`}
        confirmButtonClassName="bg-red-600 hover:bg-red-700"
        description={
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              You are permanently deleting
              <strong> {selectedIds.length} students</strong>.
            </p>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              This action cannot be undone.
            </div>
          </div>
        }
        onConfirm={handleBulkDelete}
      />

      {selectedIds.length > 0 ? (
        <StudentBulkToolbar
          count={selectedIds.length}
          archived={archived}
          onArchive={() => setBulkArchiveOpen(true)}
          onRestore={() => setBulkRestoreOpen(true)}
          onDelete={() => setBulkDeleteOpen(true)}
          onExport={() => setExportOpen(true)}
          onClear={() => setSelectedIds([])}
        />
      ) : (
        <StudentToolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          total={filteredStudents.length}
          activeFilterCount={activeFilterCount}
          onRefresh={() => router.refresh()}
          onExport={() => setExportOpen(true)}
          onOpenFilters={() => setFilterOpen(true)}
        />
      )}

      <StudentFiltersDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        classes={[...new Set(studentList.map((s) => s.className))]}
        academicYears={[...new Set(studentList.map((s) => s.academicYear))]}
      />

      {filteredStudents.length === 0 ? (
        <EmptyStudents
          search={search}
          hasActiveFilters={activeFilterCount > 0}
          title={archived ? "No Archived Students" : "No Students Yet"}
          description={
            archived
              ? "Archived students will appear here."
              : "There are no enrolled students yet. Use the 'Add Student' button above to create the first admission."
          }
        />
      ) : (
        <>
          <StudentTable
            students={paginatedStudents}
            archived={archived}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onView={handleViewStudent}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onDelete={handlePermanentDelete}
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

      <StudentProfileSheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        student={selectedStudent}
      />

      <StudentEditSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        student={selectedStudent}
        onSuccess={() => {
          setEditOpen(false);
          router.refresh();
        }}
      />

      <StudentExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        students={paginatedStudents}
        selectedIds={selectedIds}
      />
    </div>
  );
}
