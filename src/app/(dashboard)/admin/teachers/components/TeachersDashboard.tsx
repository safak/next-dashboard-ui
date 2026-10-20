"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trash2, Users } from "lucide-react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageHeader from "@/components/admin/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

import { deleteTeacher } from "@/lib/actions";

import TeachersSummary from "./TeachersSummary";
import TeachersToolbar from "./TeachersToolbar";
import TeachersTable from "./TeachersTable";
import TeacherDrawer from "./TeacherDrawer";
import EmptyTeachers from "./EmptyTeachers";

import type { TeacherFormValues } from "@/lib/formValidationSchemas";
import type { TeacherRow } from "./types";
import TeacherDetailsDrawer from "./TeacherDetailsDrawer";

interface SubjectOption {
  id: number;
  name: string;
}

interface TeacherSelectOption {
  value: string;
  label: string;
}

interface TeachersDashboardProps {
  teachers: TeacherRow[];

  subjects: SubjectOption[];

  subjectOptions: TeacherSelectOption[];

  summary: {
    totalTeachers: number;
    teachersWithClasses: number;
    teachersWithSubjects: number;
    totalLessons: number;
  };
}

export default function TeachersDashboard({
  teachers,
  subjects,
  subjectOptions,
  summary,
}: TeachersDashboardProps) {
  const router = useRouter();

  // Drawer / Dialog State

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRow | null>(
    null,
  );

  // Search / Sort State

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("name-asc");

  // Filter State

  const [subjectFilter, setSubjectFilter] = useState("all");

  const [classFilter, setClassFilter] = useState("all");

  const [lessonFilter, setLessonFilter] = useState("all");

  // Pagination State

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  // Delete State

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Active Filter Count

  const activeFilterCount = [
    subjectFilter !== "all",
    classFilter !== "all",
    lessonFilter !== "all",
  ].filter(Boolean).length;

  // Create Teacher

  const handleCreate = () => {
    setSelectedTeacher(null);
    setDrawerOpen(true);
  };

  // Edit Teacher

  const handleEdit = (teacher: TeacherRow) => {
    setSelectedTeacher(teacher);
    setDrawerOpen(true);
  };

  // View Teacher

  const handleView = (teacher: TeacherRow) => {
    setSelectedTeacher(teacher);
    setDetailsOpen(true);
  };

  // Delete Teacher

  const handleDelete = (teacher: TeacherRow) => {
    setSelectedTeacher(teacher);
    setDeleteOpen(true);
  };

  // Confirm Delete

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher) {
      return;
    }

    try {
      setDeleteLoading(true);

      const formData = new FormData();

      formData.append("id", selectedTeacher.id);

      const result = await deleteTeacher({ success: false }, formData);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete teacher.");

        return;
      }

      toast.success(
        `Teacher "${selectedTeacher.name} ${selectedTeacher.surname}" deleted successfully.`,
      );

      setDeleteOpen(false);
      setSelectedTeacher(null);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete teacher:", error);

      toast.error("Failed to delete teacher.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter + Sort Teachers

  const filteredTeachers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...teachers]
      .filter((teacher) => {
        // ----------------------------------------------
        // Search
        // ----------------------------------------------

        if (keyword) {
          const fullName = `${teacher.name} ${teacher.surname}`.toLowerCase();

          const username = teacher.username?.toLowerCase() ?? "";

          const email = teacher.email?.toLowerCase() ?? "";

          const phone = teacher.phone?.toLowerCase() ?? "";

          const teacherSubjects = teacher.subjects
            .map((subject) => subject.name.toLowerCase())
            .join(" ");

          const searchableText = [
            fullName,
            username,
            email,
            phone,
            teacherSubjects,
          ].join(" ");

          if (!searchableText.includes(keyword)) {
            return false;
          }
        }

        // ----------------------------------------------
        // Subject Filter
        // ----------------------------------------------

        if (subjectFilter !== "all") {
          const hasSubject = teacher.subjects.some(
            (subject) => String(subject.id) === subjectFilter,
          );

          if (!hasSubject) {
            return false;
          }
        }

        // ----------------------------------------------
        // Class Assignment Filter
        // ----------------------------------------------

        const classCount = teacher.supervisedClasses.length;

        switch (classFilter) {
          case "assigned":
            if (classCount === 0) {
              return false;
            }
            break;

          case "unassigned":
            if (classCount > 0) {
              return false;
            }
            break;

          case "multiple":
            if (classCount < 2) {
              return false;
            }
            break;
        }

        // ----------------------------------------------
        // Lesson Filter
        // ----------------------------------------------

        const lessonCount = teacher._count.lessons;

        switch (lessonFilter) {
          case "none":
            if (lessonCount !== 0) {
              return false;
            }
            break;

          case "has-lessons":
            if (lessonCount === 0) {
              return false;
            }
            break;

          case "high":
            if (lessonCount < 10) {
              return false;
            }
            break;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          // --------------------------------------------
          // Name
          // --------------------------------------------

          case "name-asc":
            return `${a.name} ${a.surname}`.localeCompare(
              `${b.name} ${b.surname}`,
            );

          case "name-desc":
            return `${b.name} ${b.surname}`.localeCompare(
              `${a.name} ${a.surname}`,
            );

          // --------------------------------------------
          // Subjects
          // --------------------------------------------

          case "subjects":
            return b.subjects.length - a.subjects.length;

          // --------------------------------------------
          // Classes
          // --------------------------------------------

          case "classes":
            return b.supervisedClasses.length - a.supervisedClasses.length;

          // --------------------------------------------
          // Lessons
          // --------------------------------------------

          case "lessons":
            return b._count.lessons - a._count.lessons;

          default:
            return 0;
        }
      });
  }, [teachers, search, sortBy, subjectFilter, classFilter, lessonFilter]);

  // Pagination

  const totalRecords = filteredTeachers.length;

  const paginatedTeachers = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredTeachers.slice(start, start + pageSize);
  }, [filteredTeachers, page, pageSize]);

  // Reset Page When Filters Change

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, subjectFilter, classFilter, lessonFilter]);

  // Keep Page In Range

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  // Initial Data For Edit

  const initialData: TeacherFormValues | undefined = selectedTeacher
    ? {
        id: selectedTeacher.id,

        username: selectedTeacher.username,

        email: selectedTeacher.email ?? "",

        // Never populate an existing password
        password: "",

        phone: selectedTeacher.phone ?? "",

        name: selectedTeacher.name,

        surname: selectedTeacher.surname,

        address: selectedTeacher.address,

        bloodType: selectedTeacher.bloodType,

        sex: selectedTeacher.sex,

        img: selectedTeacher.img ?? "",

        birthday: selectedTeacher.birthday ?? undefined,

        subjects: selectedTeacher.subjects.map((subject) => String(subject.id)),

        supervisedClasses: selectedTeacher.supervisedClasses.map((cls) =>
          String(cls.id),
        ),
      }
    : undefined;

  // Render

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}

      <PageHeader
        title="Teachers"
        subtitle="Manage all teachers and their academic assignments."
        image="/teachers-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* SUMMARY
      ================================================== */}

      <TeachersSummary summary={summary} />

      {/* ==================================================
          CREATE / EDIT DRAWER
      ================================================== */}

      <TeacherDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTeacher(null);
          }

          setDrawerOpen(open);
        }}
        mode={selectedTeacher ? "edit" : "create"}
        subjectOptions={subjectOptions}
        initialData={initialData}
      />

      {/* ==================================================
          VIEW TEACHER DETAILS
      ================================================== */}

      <TeacherDetailsDrawer
        open={detailsOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTeacher(null);
          }

          setDetailsOpen(open);
        }}
        teacher={selectedTeacher}
      />

      {/* ==================================================
          DELETE CONFIRMATION
      ================================================== */}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (deleteLoading) {
            return;
          }

          setDeleteOpen(open);

          if (!open) {
            setSelectedTeacher(null);
          }
        }}
        title="Delete Teacher?"
        description={
          selectedTeacher ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedTeacher.name} {selectedTeacher.surname}
              </span>
              .
              <br />
              This will also remove the associated Clerk account.
              <br />
              This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Teacher"
        cancelText="Keep Teacher"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        icon={Trash2}
        iconClassName="text-red-600"
        iconBackgroundClassName="bg-red-100"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <TeachersToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onCreate={handleCreate}
        onRefresh={() => router.refresh()}
        activeFilterCount={activeFilterCount}
        subjectFilter={subjectFilter}
        onSubjectFilterChange={setSubjectFilter}
        lessonFilter={lessonFilter}
        onLessonFilterChange={setLessonFilter}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        subjectOptions={subjectOptions}
      />

      {/* ==================================================
          TEACHERS
      ================================================== */}

      {filteredTeachers.length === 0 ? (
        <EmptyTeachers
          search={search}
          hasActiveFilters={activeFilterCount > 0}
        />
      ) : (
        <>
          <TeachersTable
            teachers={paginatedTeachers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />

          {/* ==================================================
              PAGINATION
          ================================================== */}

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
