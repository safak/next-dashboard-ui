import type { Exam, Class, Subject, Teacher } from "@prisma/client";

export type ExamWithRelations = Exam & {
  class: Class;
  subject: Subject;
  teacher: Teacher;
  _count: {
    evaluations: number;
  };
};

export type ExamFilters = {
  search?: string;
  classId?: number;
  subjectId?: number;
  page?: number;
  pageSize?: number;
};

export type ExamActionState = {
  success: boolean;
  error?: string;
};