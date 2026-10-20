"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageHeader from "@/components/admin/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { SelectOption } from "@/components/ui/form/FormSelect";

import { createLesson, updateLesson, deleteLesson } from "@/lib/actions";

import { LessonFormValues } from "@/lib/formValidationSchemas";

import LessonDrawer from "./LessonDrawer";
import LessonsSummary from "./LessonsSummary";
import LessonsToolbar from "./LessonsToolbar";
import LessonsTable from "./LessonsTable";
import EmptyLessons from "./EmptyLessons";

import type { LessonRow } from "./types";

interface SubjectOption {
  id: number;
  name: string;
}

interface ClassOption {
  id: number;
  name: string;
  academicYear: {
    id: number;
    label: string;
  };
}

interface TeacherOption {
  id: string;
  name: string;
  surname: string;
}

interface LessonsDashboardProps {
  lessons: LessonRow[];
  subjects: SubjectOption[];
  classes: ClassOption[];
  teachers: TeacherOption[];
}

const DAY_ORDER: Record<LessonRow["day"], number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

function getDayLabel(day: LessonRow["day"]) {
  switch (day) {
    case "MONDAY":
      return "Monday";

    case "TUESDAY":
      return "Tuesday";

    case "WEDNESDAY":
      return "Wednesday";

    case "THURSDAY":
      return "Thursday";

    case "FRIDAY":
      return "Friday";

    case "SATURDAY":
      return "Saturday";

    default:
      return day;
  }
}

export default function LessonsDashboard({
  lessons,
  subjects,
  classes,
  teachers,
}: LessonsDashboardProps) {
  const router = useRouter();

  /* ==================================================
     Drawer / Dialog State
  ================================================== */

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState<LessonRow | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ==================================================
     Search / Sort State
  ================================================== */

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("day-asc");

  /* ==================================================
     Filter State
  ================================================== */

  const [dayFilter, setDayFilter] = useState("ALL");

  /* ==================================================
     Pagination State
  ================================================== */

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ==================================================
     Active Filter Count
  ================================================== */

  const activeFilterCount = [dayFilter !== "ALL"].filter(Boolean).length;

  /* ==================================================
     Create
  ================================================== */

  const handleCreate = () => {
    setSelectedLesson(null);
    setDrawerOpen(true);
  };

  /* ==================================================
     Edit
  ================================================== */

  const handleEdit = (lesson: LessonRow) => {
    setSelectedLesson(lesson);
    setDrawerOpen(true);
  };

  /* ==================================================
     Delete
  ================================================== */

  const handleDelete = (lesson: LessonRow) => {
    setSelectedLesson(lesson);
    setDeleteOpen(true);
  };

  /* ==================================================
     Confirm Delete
  ================================================== */

  const handleDeleteConfirm = async () => {
    if (!selectedLesson) {
      return;
    }

    try {
      setDeleteLoading(true);

      const result = await deleteLesson(selectedLesson.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete lesson.");
        return;
      }

      toast.success(`Lesson "${selectedLesson.name}" deleted successfully.`);

      setDeleteOpen(false);
      setSelectedLesson(null);

      router.refresh();
    } catch (error) {
      console.error("Delete lesson error:", error);

      toast.error("Failed to delete lesson.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ==================================================
     Create / Update
  ================================================== */

  const handleSubmit = async (values: LessonFormValues) => {
    try {
      setLoading(true);

      const result = selectedLesson
        ? await updateLesson(
            { success: false },
            {
              ...values,
              id: selectedLesson.id,
            },
          )
        : await createLesson({ success: false }, values);

      if (!result.success) {
        toast.error(result.error ?? "Failed to save lesson.");
        return;
      }

      toast.success(
        selectedLesson
          ? "Lesson updated successfully."
          : "Lesson created successfully.",
      );

      setDrawerOpen(false);
      setSelectedLesson(null);

      router.refresh();
    } catch (error) {
      console.error("Save lesson error:", error);

      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     Filter / Sort Lessons
  ================================================== */

  const filteredLessons = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...lessons]
      .filter((lesson) => {
        if (dayFilter !== "ALL" && lesson.day !== dayFilter) {
          return false;
        }

        return true;
      })
      .filter((lesson) => {
        if (!keyword) {
          return true;
        }

        const lessonName = lesson.name.toLowerCase();

        const subjectName = lesson.subject.name.toLowerCase();

        const className = lesson.class.name.toLowerCase();

        const academicYear = lesson.class.academicYear.label.toLowerCase();

        const teacherName =
          `${lesson.teacher.name} ${lesson.teacher.surname}`.toLowerCase();

        return (
          lessonName.includes(keyword) ||
          subjectName.includes(keyword) ||
          className.includes(keyword) ||
          academicYear.includes(keyword) ||
          teacherName.includes(keyword)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "day-asc":
            return DAY_ORDER[a.day] - DAY_ORDER[b.day];

          case "day-desc":
            return DAY_ORDER[b.day] - DAY_ORDER[a.day];

          case "start-asc":
            return a.startTime.getTime() - b.startTime.getTime();

          case "start-desc":
            return b.startTime.getTime() - a.startTime.getTime();

          case "subject-asc":
            return a.subject.name.localeCompare(b.subject.name);

          case "subject-desc":
            return b.subject.name.localeCompare(a.subject.name);

          case "class-asc":
            return a.class.name.localeCompare(b.class.name);

          case "class-desc":
            return b.class.name.localeCompare(a.class.name);

          case "teacher-asc":
            return `${a.teacher.name} ${a.teacher.surname}`.localeCompare(
              `${b.teacher.name} ${b.teacher.surname}`,
            );

          case "teacher-desc":
            return `${b.teacher.name} ${b.teacher.surname}`.localeCompare(
              `${a.teacher.name} ${a.teacher.surname}`,
            );

          default:
            return DAY_ORDER[a.day] - DAY_ORDER[b.day];
        }
      });
  }, [lessons, search, dayFilter, sortBy]);

  /* ==================================================
     Pagination
  ================================================== */

  const totalRecords = filteredLessons.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedLessons = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredLessons.slice(start, start + pageSize);
  }, [filteredLessons, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, dayFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* ==================================================
     Summary
  ================================================== */

  const totalSubjects = new Set(lessons.map((lesson) => lesson.subjectId)).size;

  const totalClasses = new Set(lessons.map((lesson) => lesson.classId)).size;

  const totalTeachers = new Set(lessons.map((lesson) => lesson.teacherId)).size;

  /* ==================================================
     Select Options
  ================================================== */

  const subjectOptions: SelectOption[] = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }));

  const classOptions: SelectOption[] = classes.map((cls) => ({
    value: cls.id,
    label: `${cls.name} — ${cls.academicYear.label}`,
  }));

  const teacherOptions: SelectOption[] = teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.name} ${teacher.surname}`,
  }));

  const lessonInitialData: LessonFormValues | undefined = selectedLesson
    ? {
        id: selectedLesson.id,
        name: selectedLesson.name,
        // Temporary date value for the required form field.
        // Replace this if lessons need a real calendar date.
        scheduleDate: new Date(),
        day: selectedLesson.day,
        startTime: selectedLesson.startTime,
        endTime: selectedLesson.endTime,
        subjectId: selectedLesson.subjectId,
        classId: selectedLesson.classId,
        teacherId: selectedLesson.teacherId,
      }
    : undefined;

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}

      <PageHeader
        title="Lessons"
        subtitle="Manage all lessons and class schedules for your school."
        image="/lessons-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* SUMMARY CARDS */}

      <LessonsSummary
        summary={{
          totalLessons: lessons.length,
          totalSubjects,
          totalClasses,
          totalTeachers,
        }}
      />

      {/* CREATE / EDIT DRAWER */}

      <LessonDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);

          if (!open) {
            setSelectedLesson(null);
          }
        }}
        subjectOptions={subjectOptions}
        classOptions={classOptions}
        teacherOptions={teacherOptions}
        mode={selectedLesson ? "edit" : "create"}
        initialData={lessonInitialData}
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
            setSelectedLesson(null);
          }
        }}
        title="Delete Lesson?"
        description={
          selectedLesson ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedLesson.name}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Lesson"
        cancelText="Keep Lesson"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a lesson being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
        loading={deleteLoading}
      />

      {/* TOOLBAR */}

      <LessonsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        dayFilter={dayFilter}
        onDayFilterChange={setDayFilter}
        total={totalRecords}
        onRefresh={() => router.refresh()}
        onCreate={handleCreate}
        activeFilterCount={activeFilterCount}
      />

      {/* LESSONS */}

      {filteredLessons.length === 0 ? (
        <EmptyLessons search={search} hasActiveFilters={dayFilter !== "ALL"} />
      ) : (
        <>
          <LessonsTable
            lessons={paginatedLessons}
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
