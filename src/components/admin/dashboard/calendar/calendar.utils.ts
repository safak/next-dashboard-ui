// src/components/admin/dashboard/calendar/calendar.utils.ts

/**
 * Convert a date into yyyy-mm-dd format.
 */
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Check if the given date is today.
 */
export function isToday(date: Date): boolean {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Sunday check.
 */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Second Saturday.
 */
export function isSecondSaturday(date: Date): boolean {
  return (
    date.getDay() === 6 &&
    date.getDate() >= 8 &&
    date.getDate() <= 14
  );
}

/**
 * Fourth Saturday.
 * (Future use)
 */
export function isFourthSaturday(date: Date): boolean {
  return (
    date.getDay() === 6 &&
    date.getDate() >= 22 &&
    date.getDate() <= 28
  );
}

/**
 * Indian date formatter.
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

/**
 * Month + Year formatter.
 */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Time formatter.
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}