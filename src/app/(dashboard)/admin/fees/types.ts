import type { PaymentMode, FeeStatus } from "@prisma/client";

import type { AssignFeeValues } from "@/lib/formValidationSchemas";

export type FeeWithRelations = {
  id: number;

  studentId: string;
  planId: number;

  installment: "ADMISSION" | "TERM_1" | "TERM_2";

  dueDate: Date | null;

  totalAmount: number;
  paidAmount: number;

  status: FeeStatus;

  receiptNo: string | null;
  verifyHash: string | null;

  createdAt: Date;
  updatedAt: Date;

  student: {
    id: string;
    name: string;
    surname: string;

    class: {
      id: number;
      name: string;
    } | null;

    academicYear: {
      id: number;
      label: string;
    } | null;
  };

  plan: {
    id: number;

    originalFee: number;
    discount: number;
    finalFee: number;

    admissionAmount: number;
    term1Amount: number;
    term2Amount: number;

    academicYear: {
      id: number;
      label: string;
    };

    feeStructure: {
      id: number;
      title: string;
      annualFee: number;
      admissionFee: number;
      classId: number;
      isActive: boolean;
    };
  };

  payments: {
    id: number;
    amount: number;
    paidAt: Date;
    referenceId: string | null;
    mode: PaymentMode;
  }[];

  _count: {
    payments: number;
  };
};

export interface FeeActionState {
  success: boolean;
  error?: string;
}

export type FeeFormData = AssignFeeValues;

export type FeePlanValues = AssignFeeValues;

export interface PaymentFormData {
  studentFeeId: number;
  amount: number;
  mode: PaymentMode;
  referenceId?: string;
}