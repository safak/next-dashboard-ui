"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { toast } from "react-toastify";

import { deleteSubject } from "@/lib/actions";

import SubjectDrawer from "./SubjectDrawer";
import SubjectsSummary from "./SubjectsSummary";
import SubjectsToolbar from "./SubjectsToolbar";
import EmptySubjects from "./EmptySubjects";
import SubjectsTable from "./SubjectsTable";
import type { SubjectRow } from "./types";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";
import type { SelectOption } from "@/components/ui/form/FormSelect";

interface TeacherOption {
  id: string;
  name: string;
  surname: string;
}

interface SubjectsDashboardProps {
  subjects: SubjectRow[];
  teachers: TeacherOption[];
}

export default function SubjectsDashboard({
  subjects,
  teachers,
}: SubjectsDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<SubjectRow | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const [teacherFilter, setTeacherFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const teacherOptions = useMemo<SelectOption[]>(
    () =>
      teachers.map((teacher) => ({
        value: teacher.id,
        label: `${teacher.name} ${teacher.surname}`,
      })),
    [teachers],
  );

  const activeFilterCount = teacherFilter !== "all" ? 1 : 0;

  const handleCreate = () => {
    setSelectedSubject(null);
    setDrawerOpen(true);
  };

  const handleEdit = (subject: SubjectRow) => {
    setSelectedSubject(subject);
    setDrawerOpen(true);
  };

  const handleDelete = (subject: SubjectRow) => {
    setSelectedSubject(subject);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubject) return;

    const formData = new FormData();
    formData.append("id", String(selectedSubject.id));

    const result = await deleteSubject({ success: false }, formData);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete subject.");
      return;
    }

    toast.success("Subject deleted successfully.");

    setDeleteOpen(false);
    setSelectedSubject(null);

    router.refresh();
  };

  const filteredSubjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...subjects]
      .filter((subject) => {
        if (keyword) {
          const teacherNames = subject.teachers
            .map((teacher) => `${teacher.name} ${teacher.surname}`)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            subject.name.toLowerCase().includes(keyword) ||
            teacherNames.includes(keyword);

          if (!matchesSearch) {
            return false;
          }
        }

        if (teacherFilter !== "all") {
          const hasTeacher = subject.teachers.some(
            (teacher) => teacher.id === teacherFilter,
          );

          if (!hasTeacher) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);

          case "name-desc":
            return b.name.localeCompare(a.name);

          case "teachers":
            return b.teachers.length - a.teachers.length;

          case "lessons":
            return b._count.lessons - a._count.lessons;

          case "newest":
            return b.id - a.id;

          case "oldest":
            return a.id - b.id;

          default:
            return 0;
        }
      });
  }, [subjects, search, sortBy, teacherFilter]);

  const totalRecords = filteredSubjects.length;

  const paginatedSubjects = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredSubjects.slice(start, start + pageSize);
  }, [filteredSubjects, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, teacherFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const totalLessons = useMemo(
    () =>
      subjects.reduce((total, subject) => total + subject._count.lessons, 0),
    [subjects],
  );

  const teachersAssigned = useMemo(
    () =>
      new Set(
        subjects.flatMap((subject) =>
          subject.teachers.map((teacher) => teacher.id),
        ),
      ).size,
    [subjects],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Subjects"
        subtitle="Manage all subjects and their assigned teachers for your school."
        image="/subjects-icon.png"
        imageClassName="h-10 w-10"
      />

      <SubjectsSummary
        summary={{
          totalSubjects: subjects.length,
          totalLessons,
          teachersAssigned,
        }}
      />

      <SubjectDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        teacherOptions={teacherOptions}
        mode={selectedSubject ? "edit" : "create"}
        initialData={
          selectedSubject
            ? {
                id: selectedSubject.id,
                name: selectedSubject.name,
                teachers: selectedSubject.teachers.map((teacher) => teacher.id),
              }
            : undefined
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Subject?"
        description={
          selectedSubject ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedSubject.name}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Subject"
        cancelText="Keep Subject"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a subject being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      <SubjectsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
        activeFilterCount={activeFilterCount}
        teacherFilter={teacherFilter}
        onTeacherFilterChange={setTeacherFilter}
        teacherOptions={teacherOptions}
      />

      {filteredSubjects.length === 0 ? (
        <EmptySubjects
          search={search}
          hasActiveFilters={teacherFilter !== "all"}
        />
      ) : (
        <>
          <SubjectsTable
            subjects={paginatedSubjects}
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
