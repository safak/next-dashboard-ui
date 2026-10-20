"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/admin/PageHeader";

import AttendanceClassSelector from "./AttendanceClassSelector";
import AttendanceMonthPicker from "./AttendanceMonthPicker";

interface AttendanceHeaderProps {
  selectedClassId: number | null;
  selectedMonth: string;

  classOptions: {
    value: string;
    label: string;
  }[];

  isCorrectionView: boolean;

  onClassChange: (value: string) => void;
  onMonthChange: (value: string) => void;

  disabled?: boolean;
}

export default function AttendanceHeader({
  selectedClassId,
  selectedMonth,
  classOptions,
  isCorrectionView,
  onClassChange,
  onMonthChange,
  disabled = false,
}: AttendanceHeaderProps) {
  const [classOpen, setClassOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);

  /**
   * Close any open selector when entering correction mode.
   */
  useEffect(() => {
    if (!isCorrectionView) {
      return;
    }

    setClassOpen(false);
    setMonthOpen(false);
  }, [isCorrectionView]);

  /**
   * Class selector and month picker are mutually exclusive.
   */
  const handleClassOpenChange = (open: boolean) => {
    setClassOpen(open);

    if (open) {
      setMonthOpen(false);
    }
  };

  const handleMonthOpenChange = (open: boolean) => {
    setMonthOpen(open);

    if (open) {
      setClassOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}

      <div className="min-w-0 flex-1">
        <PageHeader
          title="Student Attendance"
          subtitle={
            isCorrectionView
              ? "Correct attendance for the selected student."
              : "Manage and review monthly student attendance."
          }
          image="/studentAttendance-icon.png"
          imageClassName="h-10 w-10"
        />
      </div>

      {/* ============================================================
          MONTHLY VIEW CONTROLS
          
          Hidden completely in correction mode.
      ============================================================ */}

      {!isCorrectionView && (
        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto">
          {/* CLASS */}

          <AttendanceClassSelector
            value={selectedClassId !== null ? String(selectedClassId) : ""}
            options={classOptions}
            onChange={onClassChange}
            disabled={disabled}
            open={classOpen}
            onOpenChange={handleClassOpenChange}
          />

          {/* MONTH */}

          <AttendanceMonthPicker
            value={selectedMonth}
            onChange={onMonthChange}
            disabled={disabled}
            open={monthOpen}
            onOpenChange={handleMonthOpenChange}
          />
        </div>
      )}
    </div>
  );
}
