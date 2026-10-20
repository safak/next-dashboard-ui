import { Prisma } from "@prisma/client";

export type TeacherRow = Prisma.TeacherGetPayload<{
  include: {
    subjects: {
      select: {
        id: true;
        name: true;
      };
    };

    supervisedClasses: {
      select: {
        id: true;
        name: true;
      };
    };

    _count: {
      select: {
        lessons: true;
        supervisedClasses: true;
        subjects: true;
      };
    };
  };
}>;

export interface SelectOption {
  value: string;
  label: string;
}
