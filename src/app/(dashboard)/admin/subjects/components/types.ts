// src/app/(dashboard)/admin/subjects/components/types.ts

export interface SubjectTeacher {
  id: string;
  name: string;
  surname: string;
}

export interface SubjectRow {
  id: number;
  name: string;

  teachers: SubjectTeacher[];

  _count: {
    lessons: number;
    teachers: number;
  };
}