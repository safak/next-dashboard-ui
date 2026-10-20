import {
  FeeStatus,
  FeeType,
  PaymentMode,
  TermType,
} from "@prisma/client";

export interface StudentFeeItem {
  id: number;

  totalAmount: number;
  paidAmount: number;

  dueDate: string | null;

  status: FeeStatus;

  feeStructure: {
    title: string;
    type: FeeType;
    term: TermType | null;
  };
}

export interface StudentPayment {
  id: number;

  amount: number;

  mode: PaymentMode;

  referenceId: string | null;

  paidAt: string;

  feeTitle: string;
}

export interface StudentFeeSummary {
  totalAssigned: number;
  totalPaid: number;
  totalDue: number;

  paidCount: number;
  partialCount: number;
  pendingCount: number;
}

export interface StudentFeeResponse {
  summary: StudentFeeSummary;

  fees: StudentFeeItem[];

  payments: StudentPayment[];
}