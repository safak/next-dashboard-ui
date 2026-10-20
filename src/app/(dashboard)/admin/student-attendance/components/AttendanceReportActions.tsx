"use client";

import {
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface AttendanceReportActionsProps {
  classId: number | null;
  month: string;
  disabled?: boolean;
}

export default function AttendanceReportActions({
  classId,
  month,
  disabled = false,
}: AttendanceReportActionsProps) {
  const [downloading, setDownloading] = useState<
    "excel" | "pdf" | null
  >(null);

  const downloadReport = async (
    format: "excel" | "pdf",
  ) => {
    if (!classId || !month || downloading) {
      return;
    }

    try {
      setDownloading(format);

      const response = await fetch(
        "/api/admin/student-attendance/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId,
            month,
            format,
          }),
        },
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null);

        throw new Error(
          data?.error ??
            `Failed to generate ${format.toUpperCase()} report.`,
        );
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        format === "excel"
          ? `student-attendance-${month}.xlsx`
          : `student-attendance-${month}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Attendance report download failed:",
        error,
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to download report.",
      );
    } finally {
      setDownloading(null);
    }
  };

  const isDisabled =
    disabled ||
    !classId ||
    !month ||
    downloading !== null;

  return (
    <div className="flex items-center gap-2">
      {/* EXCEL */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => downloadReport("excel")}
        className="
          inline-flex
          h-9
          items-center
          gap-1.5
          rounded-lg
          border
          border-emerald-200
          bg-emerald-50
          px-3
          text-xs
          font-semibold
          text-emerald-700
          transition
          hover:bg-emerald-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {downloading === "excel" ? (
          <Loader2
            size={14}
            className="animate-spin"
          />
        ) : (
          <FileSpreadsheet size={14} />
        )}

        <span>
          {downloading === "excel"
            ? "Exporting..."
            : "Excel"}
        </span>
      </button>

      {/* PDF */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => downloadReport("pdf")}
        className="
          inline-flex
          h-9
          items-center
          gap-1.5
          rounded-lg
          border
          border-red-200
          bg-red-50
          px-3
          text-xs
          font-semibold
          text-red-600
          transition
          hover:bg-red-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {downloading === "pdf" ? (
          <Loader2
            size={14}
            className="animate-spin"
          />
        ) : (
          <FileText size={14} />
        )}

        <span>
          {downloading === "pdf"
            ? "Exporting..."
            : "PDF"}
        </span>
      </button>
    </div>
  );
}