"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import EmptyAcademicYears from "./EmptyAcademicYears";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageHeader from "@/components/admin/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import ExcelJS from "exceljs";
import {
  createAcademicYear,
  updateAcademicYear,
  // activateAcademicYear,
  deleteAcademicYear,
} from "@/lib/actions";

import { AcademicYearSchema } from "@/lib/formValidationSchemas";

import AcademicYearDrawer from "./AcademicYearDrawer";
import AcademicYearSummary from "./AcademicYearSummary";
import AcademicYearToolbar from "./AcademicYearToolbar";
import AcademicYearTable from "./AcademicYearTable";

interface AcademicYear {
  id: number;
  label: string;
  isActive: boolean;

  _count: {
    classes: number;
    students: number;
  };
}

interface AcademicYearDashboardProps {
  academicYears: AcademicYear[];
}

export default function AcademicYearDashboard({
  academicYears,
}: AcademicYearDashboardProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleCreate = () => {
    setSelectedYear(null);
    setDrawerOpen(true);
  };

  const handleEdit = (id: number) => {
    const year = academicYears.find((academicYear) => academicYear.id === id);

    if (!year) {
      return;
    }

    setSelectedYear(year);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    const year = academicYears.find((academicYear) => academicYear.id === id);

    if (!year) {
      return;
    }

    setSelectedYear(year);
    setDeleteOpen(true);
  };

  const handleActivate = async (id: number) => {
    try {
      // await activateAcademicYear(id);

      console.log("Activate", id);

      router.refresh();
    } catch (error) {
      console.error("Activate academic year error:", error);

      toast.error("Failed to activate academic year.");
    }
  };

  const handleSubmit = async (values: AcademicYearSchema) => {
    try {
      setLoading(true);

      const result = selectedYear
        ? await updateAcademicYear(
            { success: false },
            {
              ...values,
              id: selectedYear.id,
            },
          )
        : await createAcademicYear({ success: false }, values);

      if (!result.success) {
        toast.error(result.error ?? "Failed to save academic year.");

        return;
      }

      toast.success(
        selectedYear
          ? "Academic year updated successfully."
          : "Academic year created successfully.",
      );

      setDrawerOpen(false);
      setSelectedYear(null);

      router.refresh();
    } catch (error) {
      console.error("Save academic year error:", error);

      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedYear) {
      return;
    }

    try {
      setDeleteLoading(true);

      const result = await deleteAcademicYear(selectedYear.id);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete academic year.");

        return;
      }

      toast.success(
        `Academic Year "${selectedYear.label}" deleted successfully.`,
      );

      setDeleteOpen(false);
      setSelectedYear(null);

      router.refresh();
    } catch (error) {
      console.error("Delete academic year error:", error);

      toast.error("Failed to delete academic year.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredAcademicYears = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return [...academicYears];
    }

    return academicYears.filter((year) =>
      year.label.toLowerCase().includes(keyword),
    );
  }, [academicYears, search]);

  const handleExport = async () => {
    if (filteredAcademicYears.length === 0) {
      toast.info("No academic years available to export.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();

      workbook.creator = "TrueSunshine";
      workbook.lastModifiedBy = "TrueSunshine";
      workbook.created = new Date();
      workbook.modified = new Date();

      const worksheet = workbook.addWorksheet("Academic Years");

      // ==================================================
      // TITLE
      // ==================================================

      worksheet.mergeCells("A1:D1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "Academic Years";

      titleCell.font = {
        bold: true,
        size: 16,
      };

      titleCell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      worksheet.getRow(1).height = 28;

      // ==================================================
      // EXPORT INFORMATION
      // ==================================================

      worksheet.mergeCells("A2:D2");

      const infoCell = worksheet.getCell("A2");

      infoCell.value = `Total Records: ${filteredAcademicYears.length}`;

      infoCell.font = {
        italic: true,
        size: 10,
      };

      infoCell.alignment = {
        horizontal: "center",
      };

      worksheet.getRow(2).height = 20;

      // ==================================================
      // HEADER
      // ==================================================

      const headerRow = worksheet.getRow(4);

      headerRow.values = ["Academic Year", "Status", "Classes", "Students"];

      headerRow.font = {
        bold: true,
      };

      headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      headerRow.height = 24;

      // ==================================================
      // HEADER BORDER
      // ==================================================

      headerRow.eachCell((cell) => {
        cell.border = {
          top: {
            style: "thin",
          },
          left: {
            style: "thin",
          },
          bottom: {
            style: "thin",
          },
          right: {
            style: "thin",
          },
        };
      });

      // ==================================================
      // DATA
      // ==================================================

      filteredAcademicYears.forEach((year) => {
        const row = worksheet.addRow([
          year.label,
          year.isActive ? "Active" : "Inactive",
          year._count.classes,
          year._count.students,
        ]);

        row.alignment = {
          vertical: "middle",
        };

        row.eachCell((cell) => {
          cell.border = {
            top: {
              style: "thin",
            },
            left: {
              style: "thin",
            },
            bottom: {
              style: "thin",
            },
            right: {
              style: "thin",
            },
          };
        });

        // Center numeric columns
        row.getCell(3).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        row.getCell(4).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Status alignment
        row.getCell(2).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      // ==================================================
      // COLUMN WIDTHS
      // ==================================================

      worksheet.getColumn(1).width = 22;
      worksheet.getColumn(2).width = 16;
      worksheet.getColumn(3).width = 14;
      worksheet.getColumn(4).width = 14;

      // ==================================================
      // AUTO FILTER
      // ==================================================

      worksheet.autoFilter = {
        from: "A4",
        to: "D4",
      };

      // ==================================================
      // FREEZE HEADER
      // ==================================================

      worksheet.views = [
        {
          state: "frozen",
          ySplit: 4,
        },
      ];

      // ==================================================
      // EXPORT DATE
      // ==================================================

      const exportDate = new Date();

      const formattedDate = exportDate.toISOString().split("T")[0];

      // ==================================================
      // GENERATE FILE
      // ==================================================

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `academic-years-${formattedDate}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        `${filteredAcademicYears.length} academic ${
          filteredAcademicYears.length === 1 ? "year" : "years"
        } exported successfully.`,
      );
    } catch (error) {
      console.error("Export academic years error:", error);

      toast.error("Failed to export academic years.");
    }
  };

  const totalRecords = filteredAcademicYears.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedAcademicYears = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredAcademicYears.slice(start, start + pageSize);
  }, [filteredAcademicYears, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Academic Years"
        subtitle="Manage all academic years for your school."
        image="/academicyears-icon.png"
        imageClassName="h-10 w-10"
      />

      <AcademicYearSummary academicYears={academicYears} />

      <AcademicYearDrawer
        open={drawerOpen}
        loading={loading}
        initialValues={
          selectedYear
            ? {
                id: selectedYear.id,
                label: selectedYear.label,
                isActive: selectedYear.isActive,
              }
            : undefined
        }
        academicYears={academicYears.map((year) => ({
          id: year.id,
          label: year.label,
        }))}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedYear(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (deleteLoading) {
            return;
          }

          setDeleteOpen(open);

          if (!open) {
            setSelectedYear(null);
          }
        }}
        title="Delete Academic Year?"
        description={
          selectedYear ? (
            <>
              You&apos;re about to permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedYear.label}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete Academic Year"
        cancelText="Keep Academic Year"
        onConfirm={handleDeleteConfirm}
        illustrationSrc="/delete-confirmation.png"
        illustrationAlt="Illustration showing an academic year being moved to a trash bin"
        confirmButtonClassName="
          bg-red-600
          hover:bg-red-700
          focus-visible:ring-red-500
        "
        loading={deleteLoading}
      />

      <AcademicYearToolbar
        search={search}
        onSearchChange={setSearch}
        total={totalRecords}
        onRefresh={() => router.refresh()}
        onExport={handleExport}
        onCreate={handleCreate}
      />

      {filteredAcademicYears.length === 0 ? (
        <EmptyAcademicYears search={search} />
      ) : (
        <>
          <AcademicYearTable
            academicYears={paginatedAcademicYears}
            onView={(id) => console.log("View academic year", id)}
            onEdit={handleEdit}
            onActivate={handleActivate}
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
