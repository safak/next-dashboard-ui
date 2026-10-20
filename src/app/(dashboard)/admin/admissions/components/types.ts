import { Prisma } from "@prisma/client";

export type AdmissionRow = Prisma.StudentGetPayload<{
  include: {
    class: {
      select: {
        id: true;
        name: true;
      };
    };

    parent: {
      select: {
        id: true;
        name: true;
        surname: true;
        email: true;
        phone: true;
      };
    };

    academicYear: {
      select: {
        id: true;
        label: true;
        isActive: true;
      };
    };

    studentFees: {
      select: {
        id: true;
        planId: true;
        installment: true;
        totalAmount: true;
        paidAmount: true;
        status: true;
        dueDate: true;
        receiptNo: true;

        plan: {
          select: {
            id: true;
            originalFee: true;
            discount: true;
            finalFee: true;
            admissionAmount: true;
            term1Amount: true;
            term2Amount: true;

            feeStructure: {
              select: {
                id: true;
                title: true;
                annualFee: true;
                admissionFee: true;
              };
            };
          };
        };
      };
    };

    studentDocuments: {
      select: {
        id: true;
        documentType: true;
        originalFileName: true;
        fileUrl: true;
        mimeType: true;
        fileSize: true;
        uploadedAt: true;
      };
    };
  };
}>;
