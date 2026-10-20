import type { AttendanceViewMode } from "./types";

/**
 * Default screen when admin opens Student Attendance.
 *
 * MONTH:
 *     Monthly attendance overview.
 *
 * CORRECTION:
 *     Specific-date attendance correction.
 */
export const DEFAULT_ATTENDANCE_VIEW: AttendanceViewMode = "MONTH";

/**
 * Default class that should be selected.
 *
 * We search by class name instead of hard-coding
 * a database ID.
 */
export const DEFAULT_CLASS_NAME = "Nursery";

/**
 * Admin attendance correction is restricted
 * to the currently selected month.
 */
export const CORRECTION_DATE_SCOPE = "CURRENT_MONTH" as const;

/**
 * Future months are not allowed.
 *
 * 0 means admin can select current/past months,
 * but not future months.
 */
export const MAX_FUTURE_MONTHS = 0;

/**
 * Future dates should not be available
 * for attendance correction.
 */
export const ALLOW_FUTURE_CORRECTION = false;