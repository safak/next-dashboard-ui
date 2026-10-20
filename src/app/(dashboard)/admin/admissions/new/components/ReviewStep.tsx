"use client";

import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";

import {
  User,
  Users,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  Circle,
  IndianRupee,
  ReceiptText,
} from "lucide-react";

import { StudentRegistrationFormValues } from "@/lib/formValidationSchemas";

interface FeeStructureOption {
  id: number;
  title: string;
  annualFee: number;
  admissionFee: number;
  classId: number;
}

interface ReviewStepProps {
  classes: {
    id: number;
    name: string;
  }[];

  academicYear: string;

  feeStructures: FeeStructureOption[];

  confirmed: boolean;

  onConfirmChange: (value: boolean) => void;
}

export default function ReviewStep({
  classes,
  academicYear,
  feeStructures,
  confirmed,
  onConfirmChange,
}: ReviewStepProps) {
  const { control } = useFormContext<StudentRegistrationFormValues>();

  const values = useWatch({
    control,
  }) as StudentRegistrationFormValues;

  const selectedClass = classes.find(
    (c) => c.id === Number(values.academic.classId),
  );

  const selectedFeeStructure = feeStructures.find(
    (fee) => fee.id === Number(values.academic.feeStructureId),
  );

  const annualFee = selectedFeeStructure?.annualFee ?? 0;

  const admissionFee = selectedFeeStructure?.admissionFee ?? 0;

  const discount = Math.max(Number(values.academic.discount) || 0, 0);

  const paidAmount = Math.max(Number(values.academic.paidAmount) || 0, 0);

  const finalFee = Math.max(annualFee - discount, 0);

  const effectiveAdmissionFee = Math.min(admissionFee, finalFee);

  const remainingAmount = Math.max(finalFee - effectiveAdmissionFee, 0);

  const term1Amount = Math.floor(remainingAmount / 2);

  const term2Amount = remainingAmount - term1Amount;

  const balance = Math.max(finalFee - paidAmount, 0);

  const paymentStatus =
    paidAmount <= 0 ? "PENDING" : paidAmount >= finalFee ? "PAID" : "PARTIAL";

  const documents = [
    {
      label: "Birth Certificate",
      uploaded: !!values.documents.birthCertificate,
    },
    {
      label: "Student Aadhaar",
      uploaded: !!values.documents.studentAadhaar,
    },
    {
      label: "Parent Aadhaar",
      uploaded: !!values.documents.parentAadhaar,
    },
    {
      label: "Address Proof",
      uploaded: !!values.documents.addressProof,
    },
    {
      label: "Transfer Certificate",
      uploaded: !!values.documents.transferCertificate,
      optional: true,
    },
    {
      label: "Vaccination Record",
      uploaded: !!values.documents.vaccinationRecord,
      optional: true,
    },
    {
      label: "Medical Certificate",
      uploaded: !!values.documents.medicalCertificate,
      optional: true,
    },
  ];

  const uploadedCount = documents.filter((d) => d.uploaded).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Review Admission</h2>

        <p className="mt-1 text-sm text-slate-500">
          Please review all details carefully before completing the admission.
        </p>
      </div>

      {/* Student Summary */}

      <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {values.student.img ? (
              <Image
                src={values.student.img}
                alt="Student"
                width={88}
                height={88}
                className="rounded-2xl border object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                <User className="h-10 w-10 text-slate-400" />
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {values.student.name} {values.student.surname}
              </h3>

              <p className="mt-1 text-base font-medium text-sky-700">
                {selectedClass?.name ?? "-"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {values.parent.name} {values.parent.surname}
              </p>

              <p className="text-sm text-slate-500">Parent / Guardian</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <SummaryItem label="Academic Year" value={academicYear} />

            <SummaryItem label="Gender" value={values.student.sex} />

            <SummaryItem label="Blood Group" value={values.student.bloodType} />

            <SummaryItem
              label="Date of Birth"
              value={
                values.student.birthday
                  ? values.student.birthday.toLocaleDateString("en-IN")
                  : "-"
              }
            />

            <SummaryItem
              label="Documents"
              value={`${uploadedCount}/${documents.length} Uploaded`}
            />

            <SummaryItem
              label="Status"
              value={confirmed ? "Confirmed" : "Pending Confirmation"}
            />
          </div>
        </div>
      </div>

      {/* Parent Information */}

      <ReviewCard
        title="Parent Information"
        icon={<Users className="h-5 w-5" />}
      >
        <ReviewItem
          label="Parent Name"
          value={`${values.parent.name} ${values.parent.surname}`}
        />

        <ReviewItem label="Username" value={values.parent.username} />

        <ReviewItem label="Phone" value={values.parent.phone} />

        <ReviewItem label="Email" value={values.parent.email || "-"} />

        <div className="md:col-span-2">
          <ReviewItem label="Address" value={values.parent.address} />
        </div>
      </ReviewCard>

      {/* Academic Information */}

      <ReviewCard
        title="Academic Information"
        icon={<GraduationCap className="h-5 w-5" />}
      >
        <ReviewItem label="Class" value={selectedClass?.name ?? "-"} />

        <ReviewItem label="Academic Year" value={academicYear} />

        <ReviewItem
          label="Admission Date"
          value={new Date().toLocaleDateString("en-IN")}
        />

        <ReviewItem label="Admission Number" value="Auto Generated" />

        <ReviewItem label="Roll Number" value="Auto Generated" />
      </ReviewCard>

      {/* Fee Information */}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-3">
          <IndianRupee className="h-5 w-5 text-sky-600" />

          <h3 className="font-semibold text-slate-900">Fee Information</h3>
        </div>

        <div className="p-5">
          {selectedFeeStructure ? (
            <>
              <div className="mb-5 flex flex-col gap-2 rounded-lg border border-sky-100 bg-sky-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Fee Structure
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedFeeStructure.title}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    paymentStatus === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : paymentStatus === "PARTIAL"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4">
                <AmountRow label="Annual Fee" amount={annualFee} />

                <AmountRow
                  label="Admission Fee"
                  amount={effectiveAdmissionFee}
                />

                <AmountRow
                  label="Discount"
                  amount={discount}
                  danger={discount > 0}
                />

                <AmountRow label="Final Fee" amount={finalFee} highlight />

                <AmountRow label="Amount Paid" amount={paidAmount} />

                <AmountRow
                  label="Balance"
                  amount={balance}
                  highlight
                  danger={balance > 0}
                />
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <ReceiptText className="h-5 w-5 text-sky-600" />

                  <h4 className="font-semibold text-slate-900">Payment Plan</h4>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <PaymentPlanCard
                    title="Admission"
                    amount={effectiveAdmissionFee}
                  />

                  <PaymentPlanCard title="Term 1" amount={term1Amount} />

                  <PaymentPlanCard title="Term 2" amount={term2Amount} />
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No fee structure has been selected. Please go back to the Academic
              step and select a fee structure.
            </div>
          )}
        </div>
      </div>

      {/* Documents */}

      <div className="rounded-xl border bg-white">
        <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-3">
          <FileCheck className="h-5 w-5 text-sky-600" />

          <h3 className="font-semibold">Uploaded Documents</h3>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-2">
          {documents.map((doc) => (
            <div key={doc.label} className="flex items-center gap-3">
              {doc.uploaded ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Circle className="h-5 w-5 text-slate-400" />
              )}

              <span className="text-sm text-slate-700">
                {doc.label}

                {doc.optional && (
                  <span className="ml-2 text-xs text-slate-400">
                    (Optional)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Confirmation */}

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="mt-1 h-5 w-5"
          />

          <div>
            <h4 className="font-semibold text-emerald-900">
              Final Confirmation
            </h4>

            <p className="mt-2 text-sm text-emerald-800">
              I confirm that all student details, guardian information, academic
              details, fee information and uploaded documents have been
              verified.
            </p>

            <p className="mt-2 text-xs text-emerald-700">
              Once submitted, the admission record will be created and the
              admission number and roll number will be generated automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-3">
        <div className="text-sky-600">{icon}</div>

        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>

      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function AmountRow({
  label,
  amount,
  highlight = false,
  danger = false,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-3 last:border-0">
      <span
        className={
          danger
            ? "text-red-600"
            : highlight
              ? "font-semibold text-slate-900"
              : "text-slate-600"
        }
      >
        {label}
      </span>

      <span
        className={
          danger
            ? "font-semibold text-red-600"
            : highlight
              ? "font-bold text-slate-900"
              : "font-semibold text-slate-700"
        }
      >
        ₹{amount.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function PaymentPlanCard({ title, amount }: { title: string; amount: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        ₹{amount.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
