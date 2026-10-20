export type Role = "admin" | "teacher" | "student" | "parent";

export type ClerkSessionMetadata = {
  role?: Role;
  classId?: number;
};

export type SessionUser = {
  userId: string;
  role: Role;
  classId?: number;
};

export type CalendarEventType =
  | "CLASS"
  | "HOLIDAY"
  | "EVENT"
  | "PRESENT"
  | "ABSENT";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: CalendarEventType;
  allDay?: boolean;
};

/* ================= ATTENDANCE CALENDAR ================= */

export type Attendance = {
  date: Date;
  status: "PRESENT" | "ABSENT";
};

export type AttendanceItem = {
  id: number;
  student: string;
  class: string;
  date: string;
  status: "Present" | "Absent";
};

export type Holiday = {
  id: string;
  title: string;
  date: Date;
};

export type StudentEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};
