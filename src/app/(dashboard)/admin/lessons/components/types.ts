export interface LessonRow {
  id: number;
  name: string;

  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";

  startTime: Date;
  endTime: Date;

  subjectId: number;
  classId: number;
  teacherId: string;

  subject: {
    id: number;
    name: string;
  };

  class: {
    id: number;
    name: string;
    academicYear: {
      id: number;
      label: string;
    };
  };

  teacher: {
    id: string;
    name: string;
    surname: string;
  };
}