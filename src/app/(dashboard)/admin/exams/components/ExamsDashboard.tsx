"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ExamsSummary from "./ExamsSummary";
import ExamsToolbar from "./ExamsToolbar";
import ExamsTable from "./ExamsTable";
import EmptyExams from "./EmptyExams";
import ExamDrawer from "./ExamDrawer";
import ExamsFiltersDrawer from "./ExamsFiltersDrawer";

import PageHeader from "@/components/admin/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import type { ExamWithRelations } from "../types";

import { toast } from "react-toastify";

import { deleteExam } from "../actions";

interface ExamsDashboardProps {
  exams: ExamWithRelations[];

  classes: {
    id: number;
    name: string;
  }[];

  subjects: {
    id: number;
    name: string;
  }[];

  teachers: {
    id: string;
    name: string;
    surname: string;
  }[];
}

export default function ExamsDashboard({
  exams,
  classes,
  subjects,
  teachers,
}: ExamsDashboardProps) {
  const router = useRouter();

  /* ============================================================
     SEARCH / SORT
  ============================================================ */

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("date");

  /* ============================================================
     FILTERS
  ============================================================ */

  const [classFilter, setClassFilter] = useState("all");

  const [subjectFilter, setSubjectFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ============================================================
     PAGINATION
  ============================================================ */

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  /* ============================================================
     DRAWER
  ============================================================ */

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedExam, setSelectedExam] = useState<ExamWithRelations | null>(
    null,
  );

  /* ============================================================
     DELETE
  ============================================================ */

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [examToDelete, setExamToDelete] = useState<ExamWithRelations | null>(
    null,
  );

  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ============================================================
     SUMMARY
  ============================================================ */

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcoming = exams.filter(
    (exam) => new Date(exam.examDate) >= today,
  ).length;

  const completed = exams.filter(
    (exam) => new Date(exam.examDate) < today,
  ).length;

  const totalEvaluations = exams.reduce(
    (sum, exam) => sum + exam._count.evaluations,
    0,
  );

  /* ============================================================
     CREATE
  ============================================================ */

  const openCreate = () => {
    setSelectedExam(null);
    setDrawerOpen(true);
  };

  /* ============================================================
     EDIT
  ============================================================ */

  const openEdit = (exam: ExamWithRelations) => {
    setSelectedExam(exam);
    setDrawerOpen(true);
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const handleDelete = (exam: ExamWithRelations) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete || deleteLoading) {
      return;
    }

    try {
      setDeleteLoading(true);

      const result = await deleteExam(examToDelete.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete exam.");
        return;
      }

      toast.success("Exam deleted successfully.");

      setDeleteDialogOpen(false);
      setExamToDelete(null);

      router.refresh();
    } catch (error) {
      console.error("Delete exam error:", error);

      toast.error("Failed to delete exam.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ============================================================
     FILTER OPTIONS
  ============================================================ */

  const classOptions = useMemo(
    () =>
      classes.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    [classes],
  );

  const subjectOptions = useMemo(
    () =>
      subjects.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    [subjects],
  );

  /* ============================================================
     ACTIVE FILTER COUNT
  ============================================================ */

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (classFilter !== "all") {
      count++;
    }

    if (subjectFilter !== "all") {
      count++;
    }

    if (statusFilter !== "all") {
      count++;
    }

    return count;
  }, [classFilter, subjectFilter, statusFilter]);

  /* ============================================================
     SEARCH + FILTER + SORT
  ============================================================ */

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = exams.filter((exam) => {
      /* --------------------------------------------------------
         SEARCH
      -------------------------------------------------------- */

      if (query) {
        const matchesSearch =
          exam.title.toLowerCase().includes(query) ||
          exam.class.name.toLowerCase().includes(query) ||
          exam.subject.name.toLowerCase().includes(query) ||
          `${exam.teacher.name} ${exam.teacher.surname}`
            .toLowerCase()
            .includes(query);

        if (!matchesSearch) {
          return false;
        }
      }

      /* --------------------------------------------------------
         CLASS FILTER
      -------------------------------------------------------- */

      if (classFilter !== "all" && String(exam.classId) !== classFilter) {
        return false;
      }

      /* --------------------------------------------------------
         SUBJECT FILTER
      -------------------------------------------------------- */

      if (subjectFilter !== "all" && String(exam.subjectId) !== subjectFilter) {
        return false;
      }

      /* --------------------------------------------------------
         STATUS FILTER
      -------------------------------------------------------- */

      if (statusFilter !== "all") {
        const examDate = new Date(exam.examDate);

        examDate.setHours(0, 0, 0, 0);

        const currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        let status: "upcoming" | "completed";

        if (examDate >= currentDate) {
          status = "upcoming";
        } else {
          status = "completed";
        }

        if (status !== statusFilter) {
          return false;
        }
      }

      return true;
    });

    /* ----------------------------------------------------------
       SORT
    ---------------------------------------------------------- */

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "class":
          return a.class.name.localeCompare(b.class.name);

        case "subject":
          return a.subject.name.localeCompare(b.subject.name);

        case "marks":
          return b.totalMarks - a.totalMarks;

        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "date":
        default:
          return (
            new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
          );
      }
    });
  }, [exams, search, sortBy, classFilter, subjectFilter, statusFilter]);

  /* ============================================================
     RESET PAGE WHEN SEARCH / SORT / FILTER CHANGES
  ============================================================ */

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, classFilter, subjectFilter, statusFilter]);

  /* ============================================================
     PAGINATION
  ============================================================ */

  const totalExams = filteredExams.length;

  const totalPages = Math.max(1, Math.ceil(totalExams / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedExams = useMemo(() => {
    const start = (page - 1) * pageSize;

    const end = start + pageSize;

    return filteredExams.slice(start, end);
  }, [filteredExams, page, pageSize]);

  /* ============================================================
     REFRESH
  ============================================================ */

  const handleRefresh = () => {
    router.refresh();
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <div className="space-y-4">
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Exams"
            subtitle="Manage all academic exams for your school."
            image="/exams-icon.png"
            imageClassName="h-10 w-10"
          />
        </div>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <ExamsSummary
          total={exams.length}
          upcoming={upcoming}
          completed={completed}
          totalEvaluations={totalEvaluations}
        />

        {/* ======================================================
            TOOLBAR
        ====================================================== */}

        <ExamsToolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          classFilter={classFilter}
          onClassFilterChange={setClassFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          total={totalExams}
          onCreate={openCreate}
          onRefresh={handleRefresh}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        {filteredExams.length === 0 ? (
          <EmptyExams
            search={search}
            hasActiveFilters={activeFilterCount > 0}
          />
        ) : (
          <>
            <ExamsTable
              exams={paginatedExams}
              onEdit={openEdit}
              onDelete={handleDelete}
            />

            <TablePagination
              page={page}
              pageSize={pageSize}
              total={totalExams}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </div>

      {/* ========================================================
          FILTER DRAWER
      ======================================================== */}

      <ExamsFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        subjectFilter={subjectFilter}
        onSubjectFilterChange={setSubjectFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
      />

      {/* ========================================================
          EXAM DRAWER
      ======================================================== */}

      <ExamDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);

          if (!open) {
            setSelectedExam(null);
          }
        }}
        mode={selectedExam ? "edit" : "create"}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        teacherOptions={teachers.map((teacher) => ({
          value: teacher.id,
          label: `${teacher.name} ${teacher.surname}`,
        }))}
        initialData={
          selectedExam
            ? {
                id: selectedExam.id,
                title: selectedExam.title,
                description: selectedExam.description ?? "",
                totalMarks: selectedExam.totalMarks,
                examDate: selectedExam.examDate,
                classId: selectedExam.classId,
                subjectId: selectedExam.subjectId,
                teacherId: selectedExam.teacherId,
              }
            : undefined
        }
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* ========================================================
          DELETE CONFIRMATION
      ======================================================== */}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (deleteLoading) return;

          setDeleteDialogOpen(open);

          if (!open) {
            setExamToDelete(null);
          }
        }}
        title="Delete Exam?"
        description={
          examToDelete ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {examToDelete.title}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Exam"
        cancelText="Keep Exam"
        onConfirm={handleConfirmDelete}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing an exam being moved to a trash bin"
        confirmButtonClassName="
    bg-red-600
    hover:bg-red-700
    focus-visible:ring-red-500
  "
      />
    </>
  );
}
