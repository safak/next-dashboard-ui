"use client";

import { IndianRupee } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import PaymentForm from "./PaymentForm";

interface StudentFeeOption {
  id: number;
  label: string;
  totalAmount: number;
  paidAmount: number;
}

interface PaymentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  studentFeeOptions: StudentFeeOption[];

  initialStudentFeeId?: number;
}

export default function PaymentDrawer({
  open,
  onOpenChange,
  studentFeeOptions,
  initialStudentFeeId,
}: PaymentDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Record Payment"
      description="Record a fee payment for a student."
      width="md"
      icon={<IndianRupee className="h-6 w-6" />}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="payment-form">
            Record Payment
          </Button>
        </>
      }
    >
      <PaymentForm
        studentFeeOptions={studentFeeOptions}
        initialStudentFeeId={initialStudentFeeId}
        onSuccess={() => onOpenChange(false)}
      />
    </Drawer>
  );
}
