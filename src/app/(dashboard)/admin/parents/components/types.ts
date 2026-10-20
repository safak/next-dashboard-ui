import { Prisma } from "@prisma/client";

export type ParentRow = Prisma.ParentGetPayload<{
  include: {
    students: {
      select: {
        id: true;
        name: true;
        surname: true;
        class: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };

    _count: {
      select: {
        students: true;
      };
    };
  };
}>;
