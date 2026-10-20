"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PaymentMode } from "@prisma/client";
import { collectPaymentAction } from "../actions";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

interface StudentFeeOption {
  id: number;
  label: string;
  totalAmount: number;
  paidAmount: number;
}

interface PaymentFormValues {
  studentFeeId: number;
  amount: number | "";
  mode: PaymentMode;
  referenceId: string;
}

interface PaymentFormProps {
  studentFeeOptions: StudentFeeOption[];
  initialStudentFeeId?: number;
  onSuccess?: () => void;
}

export default function PaymentForm({
  studentFeeOptions,
  initialStudentFeeId,
  onSuccess,
}: PaymentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentFormValues>({
    defaultValues: {
      studentFeeId: initialStudentFeeId ?? 0,
      amount: "",
      mode: PaymentMode.CASH,
      referenceId: "",
    },
  });

  const selectedStudentFeeId = form.watch("studentFeeId");

  const selectedFee = useMemo(
    () =>
      studentFeeOptions.find((fee) => fee.id === Number(selectedStudentFeeId)),
    [studentFeeOptions, selectedStudentFeeId],
  );

  const outstandingBalance = selectedFee
    ? Math.max(selectedFee.totalAmount - selectedFee.paidAmount, 0)
    : 0;

  useEffect(() => {
    const currentAmount = form.getValues("amount");

    if (
      selectedFee &&
      currentAmount !== "" &&
      Number(currentAmount) > outstandingBalance
    ) {
      form.setValue("amount", outstandingBalance);
    }
  }, [selectedFee, outstandingBalance, form]);

  const studentFeeOptionsMapped: SelectOption[] = studentFeeOptions.map(
    (fee) => ({
      value: fee.id,
      label: `${fee.label} · ₹${Math.max(
        fee.totalAmount - fee.paidAmount,
        0,
      ).toLocaleString("en-IN")}`,
    }),
  );

  const paymentModeOptions: SelectOption[] = [
    {
      value: PaymentMode.CASH,
      label: "Cash",
    },
    {
      value: PaymentMode.UPI,
      label: "UPI",
    },
    {
      value: PaymentMode.CARD,
      label: "Card",
    },
    {
      value: PaymentMode.BANK_TRANSFER,
      label: "Bank Transfer",
    },
  ];

  const onSubmit = (values: PaymentFormValues) => {
    if (isPending) {
      return;
    }

    if (!values.studentFeeId) {
      toast.error("Please select a student fee.");
      return;
    }

    const paymentAmount = Number(values.amount);

    if (!values.amount || paymentAmount <= 0) {
      toast.error("Payment amount must be greater than 0.");
      return;
    }

    if (paymentAmount > outstandingBalance) {
      toast.error("Payment cannot exceed the outstanding balance.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await collectPaymentAction({
          studentFeeId: Number(values.studentFeeId),
          amount: paymentAmount,
          mode: values.mode,
          referenceId: values.referenceId.trim() || undefined,
        });

        if (!result.success) {
          toast.error(result.error ?? "Failed to collect payment.");
          return;
        }

        toast.success("Payment collected successfully.");

        form.reset({
          studentFeeId: 0,
          amount: "",
          mode: PaymentMode.CASH,
          referenceId: "",
        });

        onSuccess?.();
      } catch (error) {
        console.error("Payment submit error:", error);

        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form
      id="payment-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormSection
        title="Payment Information"
        description="Enter the payment details."
      >
        <div>
          <FormSelect
            control={form.control}
            name="studentFeeId"
            label="Student Fee"
            placeholder="Select student fee"
            required
            options={studentFeeOptionsMapped}
            emptyTitle="No Outstanding Fees"
            emptyDescription="There are no student fees available for payment."
            disabled={isPending}
            valueAsNumber
          />

          {selectedFee && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              Outstanding balance: ₹{outstandingBalance.toLocaleString("en-IN")}
            </p>
          )}
        </div>

        <FormInput
          control={form.control}
          name="amount"
          label="Payment Amount"
          type="number"
          min={1}
          max={outstandingBalance || undefined}
          placeholder="Enter payment amount"
          required
          disabled={isPending || !selectedFee || outstandingBalance <= 0}
        />

        <FormSelect
          control={form.control}
          name="mode"
          label="Payment Mode"
          placeholder="Select payment mode"
          required
          options={paymentModeOptions}
          disabled={isPending}
        />

        <FormInput
          control={form.control}
          name="referenceId"
          label="Reference ID"
          placeholder="Optional transaction/reference ID"
          disabled={isPending}
        />
      </FormSection>
    </form>
  );
}
