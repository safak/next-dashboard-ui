export type AttendanceStatus = "PRESENT" | "ABSENT" | undefined;

export type SavedAttendanceStatus = "PRESENT" | "ABSENT";

export type AttendanceViewMode = "MONTH" | "CORRECTION";

/**
 * Class option used by the admin class selector.
 */
export interface ClassOption {
  id: number;
  name: string;

  academicYear: {
    label: string;
  };
}

/**
 * One date-wise attendance record.
 *
 * Only actual attendance records are returned.
 * If a working day is missing from this array,
 * the frontend treats that date as PENDING.
 */
export type MonthlyAttendanceDayStatus = "PRESENT" | "ABSENT";

export interface MonthlyAttendanceDay {
  date: string;
  status: MonthlyAttendanceDayStatus;
}

/**
 * Monthly attendance information for one student.
 */
export interface MonthlyAttendanceStudent {
  id: string;

  name: string;

  surname?: string | null;

  rollNo: string;

  admissionNo: string;

  /**
   * Total PRESENT records for the selected month.
   */
  present: number;

  /**
   * Total ABSENT records for the selected month.
   */
  absent: number;

  /**
   * Working days without a PRESENT/ABSENT record.
   */
  pending: number;

  /**
   * PRESENT / (PRESENT + ABSENT) × 100
   */
  attendancePercentage: number;

  /**
   * Actual date-wise attendance records.
   *
   * Example:
   *
   * [
   *   {
   *     date: "2026-08-01",
   *     status: "PRESENT"
   *   },
   *   {
   *     date: "2026-08-02",
   *     status: "ABSENT"
   *   }
   * ]
   *
   * A missing working-day date means PENDING.
   */
  attendance: MonthlyAttendanceDay[];
}

/**
 * Complete monthly attendance response.
 */
export interface MonthlyAttendanceData {
  month: string;

  totalStudents: number;

  workingDays: number;

  /**
   * Actual working dates in the selected month.
   *
   * Example:
   * [
   *   "2026-08-01",
   *   "2026-08-03",
   *   "2026-08-04",
   *   ...
   * ]
   *
   * Sundays and full-day holidays are excluded.
   */
  workingDayKeys: string[];

  completedDays: number;

  futureDays: number;

  expectedRecords: number;

  markedRecords: number;

  present: number;

  absent: number;

  pending: number;

  attendancePercentage: number;

  students: MonthlyAttendanceStudent[];
}

/**
 * Summary-only version of monthly attendance.
 *
 * Useful for MonthlyAttendanceSummary.
 */
export interface AttendanceMonthlySummary {
  totalStudents: number;

  workingDays: number;

  completedDays: number;

  futureDays: number;

  expectedRecords: number;

  markedRecords: number;

  present: number;

  absent: number;

  pending: number;

  attendancePercentage: number;
}
