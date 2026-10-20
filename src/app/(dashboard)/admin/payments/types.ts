import { Prisma } from "@prisma/client";

export type PaymentWithRelations = Prisma.PaymentGetPayload<{
  include: {
    studentFee: {
      include: {
        student: true;
      };
    };
  };
}>;
