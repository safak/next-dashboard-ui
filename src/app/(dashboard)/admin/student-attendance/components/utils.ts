/**
 * ============================================================
 * DATE UTILITIES
 * ============================================================
 *
 * IMPORTANT:
 *
 * Attendance dates are DATE-ONLY values.
 *
 * Example:
 *   "2026-08-19"
 *
 * We keep the UI/application representation as YYYY-MM-DD
 * strings and only convert to Date when required by Prisma
 * or another API.
 *
 * For DATE values stored in PostgreSQL, always create the
 * Date at UTC midnight to prevent timezone shifting.
 * ============================================================
 */

/**
 * Returns today's date in YYYY-MM-DD format.
 *
 * Example:
 *   2026-08-19
 *
 * Uses the server/browser local calendar date.
 */
export function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Returns the current month in YYYY-MM format.
 *
 * Example:
 *   2026-08
 */
export function getCurrentMonth(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

/**
 * Converts YYYY-MM-DD into a UTC Date object.
 *
 * IMPORTANT:
 *
 * Do NOT use:
 *
 *   new Date(year, month - 1, day)
 *
 * for database DATE values.
 *
 * That creates local midnight:
 *
 *   2026-08-01 00:00 IST
 *
 * which becomes:
 *
 *   2026-07-31 18:30 UTC
 *
 * and can cause PostgreSQL DATE values to be saved
 * one day earlier.
 *
 * Instead, create UTC midnight:
 *
 *   2026-08-01T00:00:00.000Z
 */
export function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(`Invalid date "${value}". Expected YYYY-MM-DD.`);
  }

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Converts YYYY-MM into a UTC Date object.
 *
 * Example:
 *   "2026-08"
 *
 * becomes:
 *   2026-08-01T00:00:00.000Z
 */
export function parseMonth(value: string): Date {
  const [year, month] = value.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(`Invalid month "${value}". Expected YYYY-MM.`);
  }

  return new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
}

/**
 * Converts Date → YYYY-MM-DD.
 *
 * IMPORTANT:
 *
 * This function assumes the Date represents a UTC date
 * when it is being used for a database DATE value.
 */
export function formatDateToISO(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Converts Date → YYYY-MM.
 *
 * Uses UTC components because database DATE values are
 * represented at UTC midnight.
 */
export function formatMonthToISO(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

/**
 * Returns the first day of the selected month.
 *
 * Example:
 *   getMonthStart("2026-08")
 *
 * returns:
 *   2026-08-01T00:00:00.000Z
 */
export function getMonthStart(month: string): Date {
  const [year, monthNumber] = month.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(monthNumber) ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    throw new Error(`Invalid month "${month}". Expected YYYY-MM.`);
  }

  return new Date(Date.UTC(year, monthNumber - 1, 1, 0, 0, 0, 0));
}

/**
 * Returns the last day of the selected month.
 *
 * Example:
 *   getMonthEnd("2026-08")
 *
 * returns:
 *   2026-08-31T00:00:00.000Z
 */
export function getMonthEnd(month: string): Date {
  const [year, monthNumber] = month.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(monthNumber) ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    throw new Error(`Invalid month "${month}". Expected YYYY-MM.`);
  }

  return new Date(Date.UTC(year, monthNumber, 0, 0, 0, 0, 0));
}

/**
 * Returns number of calendar days in a month.
 *
 * Example:
 *   getDaysInMonth("2026-08")
 *
 * returns:
 *   31
 */
export function getDaysInMonth(month: string): number {
  return getMonthEnd(month).getUTCDate();
}

/**
 * Checks whether a date belongs to a particular month.
 *
 * Example:
 *
 *   isDateInMonth(
 *     "2026-08-19",
 *     "2026-08",
 *   )
 *
 * returns:
 *   true
 */
export function isDateInMonth(date: string, month: string): boolean {
  return date.startsWith(`${month}-`);
}

/**
 * Checks whether a date is today or in the past.
 *
 * Because YYYY-MM-DD is lexicographically sortable,
 * string comparison is safe here.
 */
export function isTodayOrPast(date: string): boolean {
  return date <= getTodayDate();
}

/**
 * Checks whether a date is in the future.
 */
export function isFutureDate(date: string): boolean {
  return date > getTodayDate();
}

/**
 * Formats YYYY-MM into:
 *
 *   August 2026
 */
export function formatMonthLabel(month: string): string {
  const date = parseMonth(month);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Safely calculates an attendance percentage.
 *
 * Example:
 *
 *   calculatePercentage(14, 15)
 *
 * returns:
 *   93.33
 */
export function calculatePercentage(
  numerator: number,
  denominator: number,
): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return 0;
  }

  return Number(((numerator / denominator) * 100).toFixed(2));
}

/**
 * Formats percentage for UI.
 *
 * Example:
 *
 *   formatAttendancePercentage(88.235)
 *
 * returns:
 *   88.2%
 */
export function formatAttendancePercentage(value: number): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(1)}%`;
}
