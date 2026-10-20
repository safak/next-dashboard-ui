"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { toast } from "react-toastify";
import { Building2 } from "lucide-react";

import { deleteClass } from "@/lib/actions";

import ClassDrawer from "./ClassDrawer";
import ClassesSummary from "./ClassesSummary";
import ClassesToolbar from "./ClassesToolbar";
import EmptyClasses from "./EmptyClasses";
import ClassesTable from "./ClassesTable";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";
import { SelectOption } from "@/components/ui/form/FormSelect";
import ClassDetailsDrawer from "./ClassDetailsDrawer";

type ClassRow = Prisma.ClassGetPayload<{
  include: {
    supervisor: {
      select: {
        id: true;
        name: true;
        surname: true;
      };
    };

    _count: {
      select: {
        students: true;
      };
    };
  };
}>;

interface ClassesDashboardProps {
  classes: ClassRow[];

  teacherOptions: SelectOption[];

  summary: {
    totalClasses: number;
    totalStudents: number;
    totalCapacity: number;
    assignedTeachers: number;
  };
}

export default function ClassesDashboard({
  classes,
  summary,
  teacherOptions,
}: ClassesDashboardProps) {
  const router = useRouter();

  // ==================================================
  // Drawer / Dialog State
  // ==================================================

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState<ClassRow | null>(null);

  const availableTeacherOptions = useMemo(() => {
    const assignedTeacherIds = new Set<string>();

    classes.forEach((cls) => {
      if (cls.supervisorId) {
        assignedTeacherIds.add(cls.supervisorId);
      }
    });

    return teacherOptions.filter((teacher) => {
      const teacherId = String(teacher.value);

      // Create
      if (!selectedClass) {
        return !assignedTeacherIds.has(teacherId);
      }

      // Edit: keep current teacher
      const currentTeacherId = String(selectedClass.supervisorId);

      if (teacherId === currentTeacherId) {
        return true;
      }

      // Hide teachers assigned elsewhere
      return !assignedTeacherIds.has(teacherId);
    });
  }, [classes, teacherOptions, selectedClass]);

  // Search / Sort State

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  // Filter State

  const [teacherFilter, setTeacherFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");

  // Pagination State

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Active Filter Count
  const activeFilterCount = [
    teacherFilter !== "all",
    studentFilter !== "all",
    capacityFilter !== "all",
  ].filter(Boolean).length;

  // Create
  const handleCreate = () => {
    setSelectedClass(null);
    setDrawerOpen(true);
  };

  // Edit
  const handleEdit = (cls: ClassRow) => {
    setSelectedClass(cls);
    setDrawerOpen(true);
  };

  // Delete
  const handleDelete = (cls: ClassRow) => {
    setSelectedClass(cls);
    setDeleteOpen(true);
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!selectedClass) return;

    const result = await deleteClass(selectedClass.id);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete class.");
      return;
    }

    toast.success("Class deleted successfully.");

    setDeleteOpen(false);
    setSelectedClass(null);

    router.refresh();
  };

  // View Details
  const handleView = (cls: ClassRow) => {
    setSelectedClass(cls);
    setDetailsOpen(true);
  };

  const filteredClasses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...classes]
      .filter((cls) => {
        if (keyword && !cls.name.toLowerCase().includes(keyword)) {
          return false;
        }

        if (teacherFilter !== "all" && cls.supervisorId !== teacherFilter) {
          return false;
        }

        const students = cls._count.students;
        const capacity = cls.capacity;

        switch (studentFilter) {
          case "empty":
            if (students !== 0) {
              return false;
            }
            break;

          case "has-students":
            if (students === 0) {
              return false;
            }
            break;

          case "full":
            if (students < capacity) {
              return false;
            }
            break;
        }

        switch (capacityFilter) {
          case "small":
            if (capacity > 15) {
              return false;
            }
            break;

          case "medium":
            if (capacity < 16 || capacity > 25) {
              return false;
            }
            break;

          case "large":
            if (capacity < 26) {
              return false;
            }
            break;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);

          case "name-desc":
            return b.name.localeCompare(a.name);

          case "teacher":
            return `${a.supervisor.name} ${a.supervisor.surname}`.localeCompare(
              `${b.supervisor.name} ${b.supervisor.surname}`,
            );

          case "students":
            return b._count.students - a._count.students;

          case "capacity":
            return b.capacity - a.capacity;

          case "newest":
            return b.id - a.id;

          case "oldest":
            return a.id - b.id;

          default:
            return 0;
        }
      });
  }, [classes, search, sortBy, teacherFilter, studentFilter, capacityFilter]);

  const totalRecords = filteredClasses.length;

  const paginatedClasses = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredClasses.slice(start, start + pageSize);
  }, [filteredClasses, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, teacherFilter, studentFilter, capacityFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}

      <PageHeader
        title="Classes"
        subtitle="Manage all academic classes for your school."
        image="/classes-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* SUMMARY CARDS */}

      <ClassesSummary summary={summary} />

      {/* CREATE / EDIT DRAWER */}

      <ClassDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        teacherOptions={availableTeacherOptions}
        mode={selectedClass ? "edit" : "create"}
        initialData={
          selectedClass
            ? {
                id: selectedClass.id,
                name: selectedClass.name,
                capacity: selectedClass.capacity,
                rollPrefix: selectedClass.rollPrefix,
                supervisorId: selectedClass.supervisorId,
                gradeId: selectedClass.gradeId ?? undefined,
              }
            : undefined
        }
      />

      {/* VIEW CLASS DETAILS */}

      <ClassDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        classData={selectedClass}
      />

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Class?"
        description={
          selectedClass ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedClass.name}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Class"
        cancelText="Keep Class"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a class being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      {/* TOOLBAR */}
      <ClassesToolbar
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
        studentFilter={studentFilter}
        onStudentFilterChange={setStudentFilter}
        capacityFilter={capacityFilter}
        onCapacityFilterChange={setCapacityFilter}
        teacherOptions={teacherOptions}
      />

      {/* CLASSES */}

      {filteredClasses.length === 0 ? (
        <EmptyClasses
          onCreate={handleCreate}
          search={search}
          hasActiveFilters={
            teacherFilter !== "all" ||
            studentFilter !== "all" ||
            capacityFilter !== "all"
          }
        />
      ) : (
        <>
          <ClassesTable
            classes={paginatedClasses}
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
