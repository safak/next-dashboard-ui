import { Prisma } from "@prisma/client";

export type ResultWithRelations = Prisma.ResultGetPayload<{
  include: {
    student: {
      include: {
        class: true;
      };
    };
    exam: true;
    assignment: true;
  };
}>;