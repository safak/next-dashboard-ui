"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { ClipboardCheck } from "lucide-react";

import { deleteResult } from "../actions";

import type { ResultWithRelations } from "../types";

import Drawer from "@/components/ui/Drawer";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";
import { Button } from "@/components/ui/button";

import ResultsSummary from "./ResultsSummary";
import ResultsToolbar from "./ResultsToolbar";
import ResultsFiltersDrawer from "./ResultsFiltersDrawer";
import ResultsTable from "./ResultsTable";
import ResultForm from "./ResultForm";
import EmptyResults from "./EmptyResults";

interface ResultsDashboardProps {
  results: ResultWithRelations[];

  classes?: {
    id: number;
    name: string;
  }[];

  students: {
    id: string;
    name: string;
    surname: string;
    class: {
      id: number;
      name: string;
    } | null;
  }[];

  exams: {
    id: number;
    title: string;
    totalMarks: number;
    examDate: Date;
    classId: number;
    subjectId: number;
  }[];

  assignments: {
    id: number;
    title: string;
    totalMarks: number;
    dueDate: Date;
    classId: number;
    subjectId: number;
  }[];
}

export default function ResultsDashboard({
  results,
  classes,
  students,
  exams,
  assignments,
}: ResultsDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedResult, setSelectedResult] =
    useState<ResultWithRelations | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("student-asc");

  const [classFilter, setClassFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeFilterCount = [
    classFilter !== "all",
    examFilter !== "all",
    assignmentFilter !== "all",
    typeFilter !== "all",
  ].filter(Boolean).length;

  const availableClasses = useMemo(() => {
    const uniqueClasses = new Map<number, string>();

    students.forEach((student) => {
      if (student.class) {
        uniqueClasses.set(student.class.id, student.class.name);
      }
    });

    return Array.from(uniqueClasses.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({
        id,
        name,
      }));
  }, [students]);

  const classOptions = useMemo(
    () =>
      availableClasses.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    [availableClasses],
  );

  const examOptions = useMemo(
    () =>
      exams.map((exam) => ({
        value: String(exam.id),
        label: exam.title,
      })),
    [exams],
  );

  const assignmentOptions = useMemo(
    () =>
      assignments.map((assignment) => ({
        value: String(assignment.id),
        label: assignment.title,
      })),
    [assignments],
  );

  const handleCreate = () => {
    setSelectedResult(null);
    setDrawerOpen(true);
  };

  const handleEdit = (result: ResultWithRelations) => {
    setSelectedResult(result);
    setDrawerOpen(true);
  };

  const handleDelete = (result: ResultWithRelations) => {
    setSelectedResult(result);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResult) {
      return;
    }

    const formData = new FormData();

    formData.append("id", String(selectedResult.id));

    const result = await deleteResult(
      {
        success: false,
      },
      formData,
    );

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete result.");
      return;
    }

    toast.success("Result deleted successfully.");

    setDeleteOpen(false);
    setSelectedResult(null);

    router.refresh();
  };

  const filteredResults = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...results]
      .filter((result) => {
        const studentName =
          `${result.student.name} ${result.student.surname}`.toLowerCase();

        const studentId = result.student.id.toLowerCase();

        const className = result.student.class?.name.toLowerCase() ?? "";

        const examTitle = result.exam?.title.toLowerCase() ?? "";

        const assignmentTitle = result.assignment?.title.toLowerCase() ?? "";

        if (
          keyword &&
          !studentName.includes(keyword) &&
          !studentId.includes(keyword) &&
          !className.includes(keyword) &&
          !examTitle.includes(keyword) &&
          !assignmentTitle.includes(keyword)
        ) {
          return false;
        }

        if (
          classFilter !== "all" &&
          String(result.student.class?.id ?? "") !== classFilter
        ) {
          return false;
        }

        if (
          examFilter !== "all" &&
          String(result.examId ?? "") !== examFilter
        ) {
          return false;
        }

        if (
          assignmentFilter !== "all" &&
          String(result.assignmentId ?? "") !== assignmentFilter
        ) {
          return false;
        }

        if (typeFilter === "exam" && !result.examId) {
          return false;
        }

        if (typeFilter === "assignment" && !result.assignmentId) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "student-asc":
            return `${a.student.name} ${a.student.surname}`.localeCompare(
              `${b.student.name} ${b.student.surname}`,
            );

          case "student-desc":
            return `${b.student.name} ${b.student.surname}`.localeCompare(
              `${a.student.name} ${a.student.surname}`,
            );

          case "score-high":
            return b.score - a.score;

          case "score-low":
            return a.score - b.score;

          case "exam-asc":
            return (a.exam?.title ?? "").localeCompare(b.exam?.title ?? "");

          case "assignment-asc":
            return (a.assignment?.title ?? "").localeCompare(
              b.assignment?.title ?? "",
            );

          case "newest":
            return b.id - a.id;

          case "oldest":
            return a.id - b.id;

          default:
            return 0;
        }
      });
  }, [
    results,
    search,
    sortBy,
    classFilter,
    examFilter,
    assignmentFilter,
    typeFilter,
  ]);

  const totalRecords = filteredResults.length;

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, classFilter, examFilter, assignmentFilter, typeFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const initialFormData = selectedResult
    ? {
        id: selectedResult.id,
        score: selectedResult.score,
        studentId: selectedResult.studentId,
        examId: selectedResult.examId ?? undefined,
        assignmentId: selectedResult.assignmentId ?? undefined,
      }
    : undefined;

  const initialClassId = selectedResult?.student.class?.id;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Results"
        subtitle="Manage student examination and assignment results."
        image="/result-icon.png"
        imageClassName="h-10 w-10"
      />

      <ResultsSummary
        total={results.length}
        average={
          results.length
            ? Math.round(
                results.reduce((sum, result) => sum + result.score, 0) /
                  results.length,
              )
            : 0
        }
        examResults={results.filter((result) => Boolean(result.examId)).length}
        assignmentResults={
          results.filter((result) => Boolean(result.assignmentId)).length
        }
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width="md"
        title={selectedResult ? "Edit Result" : "Add Result"}
        description={
          selectedResult
            ? "Update the student's academic result."
            : "Enter the student's academic result."
        }
        icon={<ClipboardCheck className="h-4 w-4" />}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" form="result-form">
              {selectedResult ? "Update Result" : "Create Result"}
            </Button>
          </>
        }
      >
        <ResultForm
          mode={selectedResult ? "edit" : "create"}
          classes={availableClasses}
          students={students}
          exams={exams}
          assignments={assignments}
          initialData={initialFormData}
          initialClassId={initialClassId}
          onSuccess={() => {
            setDrawerOpen(false);
            setSelectedResult(null);
            router.refresh();
          }}
        />
      </Drawer>

      <ResultsFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        examFilter={examFilter}
        onExamFilterChange={setExamFilter}
        assignmentFilter={assignmentFilter}
        onAssignmentFilterChange={setAssignmentFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        classOptions={classOptions}
        examOptions={examOptions}
        assignmentOptions={assignmentOptions}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Result?"
        description={
          selectedResult ? (
            <>
              You&apos;re about to permanently delete the result for{" "}
              <span className="font-semibold text-slate-700">
                {selectedResult.student.name} {selectedResult.student.surname}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Result"
        cancelText="Keep Result"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a result being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      <ResultsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      {filteredResults.length === 0 ? (
        <EmptyResults
          search={search}
          hasActiveFilters={
            classFilter !== "all" ||
            examFilter !== "all" ||
            assignmentFilter !== "all" ||
            typeFilter !== "all"
          }
        />
      ) : (
        <>
          <ResultsTable
            results={paginatedResults}
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
