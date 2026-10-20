"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { Users } from "lucide-react";

import { createParent, deleteParent, updateParent } from "@/lib/actions";

import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TablePagination from "@/components/ui/TablePagination";

import ParentDrawer from "./ParentDrawer";
import ParentDetailsDrawer from "./ParentDetailsDrawer";
import ParentsSummary from "./ParentsSummary";
import ParentsToolbar from "./ParentsToolbar";
import ParentsTable from "./ParentsTable";
import EmptyParents from "./EmptyParents";

import type { ParentFormValues } from "@/lib/formValidationSchemas";
import type { ParentRow } from "./types";

interface ParentsDashboardProps {
  parents: ParentRow[];

  summary: {
    totalParents: number;
    parentsWithStudents: number;
    linkedStudents: number;
  };
}

export default function ParentsDashboard({
  parents,
  summary,
}: ParentsDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedParent, setSelectedParent] = useState<ParentRow | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [studentFilter, setStudentFilter] = useState("all");
  const [studentCountFilter, setStudentCountFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState("all");

  const activeFilterCount = [
    studentFilter !== "all",
    studentCountFilter !== "all",
    contactFilter !== "all",
  ].filter(Boolean).length;

  const handleCreate = () => {
    setSelectedParent(null);
    setDrawerOpen(true);
  };

  const handleEdit = (parent: ParentRow) => {
    setSelectedParent(parent);
    setDrawerOpen(true);
  };

  const handleView = (parent: ParentRow) => {
    setSelectedParent(parent);
    setDetailsOpen(true);
  };

  const handleDelete = (parent: ParentRow) => {
    setSelectedParent(parent);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedParent || deleteLoading) {
      return;
    }

    try {
      setDeleteLoading(true);

      const formData = new FormData();
      formData.append("id", selectedParent.id);

      const result = await deleteParent({ success: false }, formData);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete parent.");
        return;
      }

      toast.success(
        `Parent "${selectedParent.name} ${selectedParent.surname}" deleted successfully.`,
      );

      setDeleteOpen(false);
      setSelectedParent(null);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete parent:", error);

      toast.error("Failed to delete parent.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (values: ParentFormValues) => {
    try {
      setSaving(true);

      const result = selectedParent
        ? await updateParent(
            { success: false },
            {
              ...values,
              id: selectedParent.id,
            },
          )
        : await createParent({ success: false }, values);

      if (!result.success) {
        toast.error(result.error ?? "Failed to save parent.");
        return;
      }

      toast.success(
        selectedParent
          ? "Parent updated successfully."
          : "Parent created successfully.",
      );

      setDrawerOpen(false);
      setSelectedParent(null);

      router.refresh();
    } catch (error) {
      console.error("Failed to save parent:", error);

      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const filteredParents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...parents]
      .filter((parent) => {
        const studentCount = parent._count?.students ?? parent.students.length;

        if (studentFilter === "has-students") {
          if (studentCount === 0) {
            return false;
          }
        }

        if (studentFilter === "no-students") {
          if (studentCount > 0) {
            return false;
          }
        }

        if (studentCountFilter === "one") {
          if (studentCount !== 1) {
            return false;
          }
        }

        if (studentCountFilter === "multiple") {
          if (studentCount < 2) {
            return false;
          }
        }

        const hasEmail = Boolean(parent.email?.trim());

        const hasPhone = Boolean(parent.phone?.trim());

        if (contactFilter === "email" && !hasEmail) {
          return false;
        }

        if (contactFilter === "phone" && !hasPhone) {
          return false;
        }

        if (contactFilter === "both" && (!hasEmail || !hasPhone)) {
          return false;
        }

        if (!keyword) {
          return true;
        }

        const fullName = `${parent.name} ${parent.surname}`.toLowerCase();

        const username = parent.username?.toLowerCase() ?? "";

        const email = parent.email?.toLowerCase() ?? "";

        const phone = parent.phone?.toLowerCase() ?? "";

        const address = parent.address?.toLowerCase() ?? "";

        const students = parent.students
          .map(
            (student) =>
              `${student.name} ${student.surname} ${student.class?.name ?? ""}`,
          )
          .join(" ")
          .toLowerCase();

        return (
          fullName.includes(keyword) ||
          username.includes(keyword) ||
          email.includes(keyword) ||
          phone.includes(keyword) ||
          address.includes(keyword) ||
          students.includes(keyword)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return `${a.name} ${a.surname}`.localeCompare(
              `${b.name} ${b.surname}`,
            );

          case "name-desc":
            return `${b.name} ${b.surname}`.localeCompare(
              `${a.name} ${a.surname}`,
            );

          case "students":
            return b._count.students - a._count.students;

          case "username":
            return a.username.localeCompare(b.username);

          case "newest":
            return b.id.localeCompare(a.id);

          case "oldest":
            return a.id.localeCompare(b.id);

          default:
            return 0;
        }
      });
  }, [
    parents,
    search,
    sortBy,
    studentFilter,
    studentCountFilter,
    contactFilter,
  ]);

  const totalRecords = filteredParents.length;

  const paginatedParents = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredParents.slice(start, start + pageSize);
  }, [filteredParents, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, studentFilter, studentCountFilter, contactFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, totalRecords]);

  const initialValues: ParentFormValues | undefined = selectedParent
    ? {
        id: selectedParent.id,
        username: selectedParent.username,
        password: "",
        name: selectedParent.name,
        surname: selectedParent.surname,
        email: selectedParent.email ?? "",
        phone: selectedParent.phone,
        address: selectedParent.address,
      }
    : undefined;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Parents"
        subtitle="Manage parent accounts and their student relationships."
        image="/parents-icon.png"
        imageClassName="h-10 w-10"
      />

      <ParentsSummary summary={summary} />

      <ParentDrawer
        open={drawerOpen}
        loading={saving}
        initialValues={initialValues}
        onClose={() => {
          if (saving) {
            return;
          }

          setDrawerOpen(false);
          setSelectedParent(null);
        }}
        onSubmit={handleSubmit}
      />

      <ParentDetailsDrawer
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);

          if (!open) {
            setSelectedParent(null);
          }
        }}
        parent={selectedParent}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (deleteLoading) {
            return;
          }

          setDeleteOpen(open);

          if (!open) {
            setSelectedParent(null);
          }
        }}
        title="Delete Parent?"
        description={
          selectedParent ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedParent.name} {selectedParent.surname}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Parent"
        cancelText="Keep Parent"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing a parent being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
      />

      <ParentsToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        total={totalRecords}
        onRefresh={() => router.refresh()}
        onCreate={handleCreate}
        activeFilterCount={activeFilterCount}
        studentFilter={studentFilter}
        onStudentFilterChange={setStudentFilter}
        studentCountFilter={studentCountFilter}
        onStudentCountFilterChange={setStudentCountFilter}
        contactFilter={contactFilter}
        onContactFilterChange={setContactFilter}
      />

      {filteredParents.length === 0 ? (
        <EmptyParents
          search={search}
          hasActiveFilters={activeFilterCount > 0}
        />
      ) : (
        <>
          <ParentsTable
            parents={paginatedParents}
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
