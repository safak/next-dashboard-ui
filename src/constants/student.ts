// ================================
// Student Filters
// ================================

export const GENDER_OPTIONS = [
  { value: "all", label: "All Genders" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
] as const;

export const BLOOD_GROUP_OPTIONS = [
  { value: "all", label: "All Blood Groups" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
] as const;

// ================================
// Student Status
// ================================

export const STUDENT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TRANSFERRED", label: "Transferred" },
  { value: "GRADUATED", label: "Graduated" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

// ================================
// Archived Student Status
// ================================

export const ARCHIVED_STATUS_OPTIONS = [
  { value: "ARCHIVED", label: "Archived" },
] as const;

// ================================
// Default Filter Values
// ================================

export const DEFAULT_STUDENT_FILTERS = {
  className: "all",
  academicYear: "all",
  gender: "all",
  bloodType: "all",
} as const;

// ================================
// Sorting
// ================================

export const STUDENT_SORT_OPTIONS = [
  {
    value: "name-asc",
    label: "Student Name (A–Z)",
  },
  {
    value: "name-desc",
    label: "Student Name (Z–A)",
  },
  {
    value: "class",
    label: "Class",
  },
  {
    value: "admission",
    label: "Admission Number",
  },
  {
    value: "roll",
    label: "Roll Number",
  },
  {
    value: "newest",
    label: "Recently Added",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
] as const;

// ================================
// Attendance
// ================================

export const ATTENDANCE_STATUS_OPTIONS = [
  {
    value: "PRESENT",
    label: "Present",
  },
  {
    value: "ABSENT",
    label: "Absent",
  },
  {
    value: "LATE",
    label: "Late",
  },
  {
    value: "HALF_DAY",
    label: "Half Day",
  },
] as const;

