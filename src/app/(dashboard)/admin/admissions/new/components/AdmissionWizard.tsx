"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";

import AdmissionSuccessDialog from "./AdmissionSuccessDialog";
import DraftResumeDialog from "./DraftResumeDialog";
import WizardHeader from "./WizardHeader";
import WizardNavigation from "./WizardNavigation";

import StudentStep from "./StudentStep";
import ParentStep from "./ParentStep";
import AcademicStep from "./AcademicStep";
import DocumentsStep from "./DocumentsStep";
import ReviewStep from "./ReviewStep";

import { registerStudent } from "@/lib/actions/admission.actions";

import {
  saveAdmissionDraft,
  loadAdmissionDraft,
  clearAdmissionDraft,
} from "@/lib/admissionDraft";

import {
  studentRegistrationSchema,
  StudentRegistrationFormInput,
  StudentRegistrationFormValues,
} from "@/lib/formValidationSchemas";

const STEPS = [
  {
    title: "Student",
    description: "Basic Details",
  },
  {
    title: "Parent",
    description: "Guardian Details",
  },
  {
    title: "Academic",
    description: "Class & Fee",
  },
  {
    title: "Documents",
    description: "Upload Files",
  },
  {
    title: "Review",
    description: "Verify & Submit",
  },
];

const DEFAULT_VALUES: StudentRegistrationFormInput = {
  student: {
    name: "",
    surname: "",
    birthday: undefined,
    bloodType: "",
    sex: "MALE",
    img: "",
  },

  parent: {
    name: "",
    surname: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    address: "",
  },

  academic: {
    academicYearId: 0,
    classId: 0,
    feeStructureId: 0,
    discount: 0,
    paidAmount: 0,

    admissionDueDate: undefined,
    term1DueDate: undefined,
    term2DueDate: undefined,
  },

  documents: {
    birthCertificate: undefined,
    studentAadhaar: undefined,
    transferCertificate: undefined,
    parentAadhaar: undefined,
    addressProof: undefined,
    vaccinationRecord: undefined,
    medicalCertificate: undefined,
    remarks: "",
  },
};

interface FeeStructureOption {
  id: number;
  title: string;
  annualFee: number;
  admissionFee: number;
  classId: number;
}

interface AdmissionWizardProps {
  classes: {
    id: number;
    name: string;
  }[];

  feeStructures: FeeStructureOption[];

  academicYear: string;
  academicYearId: number;
}

function normalizeDate(value: unknown) {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const date = new Date(String(value));

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function AdmissionWizard({
  classes,
  feeStructures,
  academicYear,
  academicYearId,
}: AdmissionWizardProps) {
  const router = useRouter();

  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdStudentId, setCreatedStudentId] = useState<string | null>(null);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);

  const methods = useForm<
    StudentRegistrationFormInput,
    unknown,
    StudentRegistrationFormValues
  >({
    resolver: zodResolver(studentRegistrationSchema),

    mode: "onChange",

    defaultValues: {
      ...DEFAULT_VALUES,

      academic: {
        ...DEFAULT_VALUES.academic,
        academicYearId,
      },
    },
  });

  useEffect(() => {
    const draft = loadAdmissionDraft<StudentRegistrationFormValues>();

    if (draft) {
      setDraftData(draft);
      setShowDraftDialog(true);
    }

    setDraftLoaded(true);
  }, []);

  const resumeDraft = () => {
    if (!draftData) return;

    methods.reset({
      ...draftData.data,

      student: {
        ...draftData.data.student,

        birthday: normalizeDate(draftData.data.student?.birthday),
      },

      academic: {
        academicYearId:
          draftData.data.academic?.academicYearId ?? academicYearId,

        classId: draftData.data.academic?.classId ?? 0,

        feeStructureId: draftData.data.academic?.feeStructureId ?? 0,

        discount: draftData.data.academic?.discount ?? 0,

        paidAmount: draftData.data.academic?.paidAmount ?? 0,

        admissionDueDate: normalizeDate(
          draftData.data.academic?.admissionDueDate,
        ),

        term1DueDate: normalizeDate(draftData.data.academic?.term1DueDate),

        term2DueDate: normalizeDate(draftData.data.academic?.term2DueDate),
      },

      documents: {
        ...draftData.data.documents,

        transferCertificate:
          draftData.data.documents?.transferCertificate || undefined,

        vaccinationRecord:
          draftData.data.documents?.vaccinationRecord || undefined,

        medicalCertificate:
          draftData.data.documents?.medicalCertificate || undefined,
      },
    });

    setStep(draftData.step);
    setShowDraftDialog(false);
  };

  const startNewAdmission = () => {
    clearAdmissionDraft();

    methods.reset({
      ...DEFAULT_VALUES,

      academic: {
        ...DEFAULT_VALUES.academic,
        academicYearId,
      },
    });

    setStep(0);
    setDraftData(null);
    setReviewConfirmed(false);
    setShowDraftDialog(false);
  };

  const watchedValues = useWatch({
    control: methods.control,
  });

  useEffect(() => {
    if (!draftLoaded) return;
    if (showDraftDialog) return;

    const timer = setTimeout(() => {
      const normalizedData = {
        ...watchedValues,

        documents: {
          ...watchedValues.documents,

          transferCertificate:
            watchedValues.documents?.transferCertificate || undefined,

          vaccinationRecord:
            watchedValues.documents?.vaccinationRecord || undefined,

          medicalCertificate:
            watchedValues.documents?.medicalCertificate || undefined,
        },
      };

      saveAdmissionDraft(normalizedData, step);
    }, 3000);

    return () => clearTimeout(timer);
  }, [watchedValues, step, draftLoaded, showDraftDialog]);

  const next = async () => {
    let valid = false;

    switch (step) {
      case 0:
        valid = await methods.trigger([
          "student.name",
          "student.surname",
          "student.sex",
          "student.bloodType",
          "student.birthday",
        ]);
        break;

      case 1:
        valid = await methods.trigger([
          "parent.name",
          "parent.surname",
          "parent.phone",
          "parent.username",
          "parent.password",
        ]);
        break;

      case 2:
        valid = await methods.trigger([
          "academic.academicYearId",
          "academic.classId",
          "academic.feeStructureId",
          "academic.discount",
          "academic.paidAmount",
          "academic.admissionDueDate",
          "academic.term1DueDate",
          "academic.term2DueDate",
        ]);

        if (valid) {
          const { admissionDueDate, term1DueDate, term2DueDate } =
            methods.getValues("academic");

          if (
            admissionDueDate &&
            term1DueDate &&
            term1DueDate < admissionDueDate
          ) {
            methods.setError("academic.term1DueDate", {
              type: "validate",
              message:
                "Term 1 due date cannot be before the admission due date.",
            });

            valid = false;
          }

          if (term1DueDate && term2DueDate && term2DueDate < term1DueDate) {
            methods.setError("academic.term2DueDate", {
              type: "validate",
              message: "Term 2 due date cannot be before the Term 1 due date.",
            });

            valid = false;
          }
        }

        break;

      case 3:
        valid = await methods.trigger([
          "documents.birthCertificate",
          "documents.studentAadhaar",
          "documents.parentAadhaar",
          "documents.addressProof",
        ]);
        break;

      default:
        valid = true;
    }

    if (!valid) return;

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const previous = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const [isPending, startTransition] = useTransition();

  const submit = async () => {
    const values = methods.getValues();

    const normalizedValues = {
      ...values,

      documents: {
        ...values.documents,

        transferCertificate: values.documents.transferCertificate || undefined,

        vaccinationRecord: values.documents.vaccinationRecord || undefined,

        medicalCertificate: values.documents.medicalCertificate || undefined,
      },
    };

    const result = studentRegistrationSchema.safeParse(normalizedValues);

    if (!result.success) {
      console.error(result.error.flatten());

      toast.error("Please correct the highlighted validation errors.");

      return;
    }

    startTransition(async () => {
      try {
        const response = await registerStudent(result.data);

        if (!response.success) {
          toast.error(response.error ?? "Admission failed.");

          return;
        }

        clearAdmissionDraft();

        setCreatedStudentId(response.studentId!);
        setShowSuccessDialog(true);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong while creating the admission.");
      }
    });
  };

  return (
    <>
      <DraftResumeDialog
        open={showDraftDialog}
        studentName={
          draftData?.data?.student
            ? `${draftData.data.student.name} ${draftData.data.student.surname}`
            : ""
        }
        stepName={STEPS[draftData?.step ?? 0]?.title}
        savedAt={draftData?.savedAt ?? Date.now()}
        onResume={resumeDraft}
        onStartNew={startNewAdmission}
      />

      <AdmissionSuccessDialog
        open={showSuccessDialog}
        studentId={createdStudentId}
        onClose={() => {
          setShowSuccessDialog(false);
          router.push("/admin/admissions");
        }}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 px-1 text-sm">
            <button
              type="button"
              onClick={() => router.push("/admin/admissions")}
              className="font-medium text-slate-500 transition-colors hover:text-sky-600"
            >
              Admissions
            </button>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="font-semibold text-slate-900">New Admission</span>
          </div>

          <WizardHeader currentStep={step} steps={STEPS} />

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            {step === 0 && <StudentStep />}

            {step === 1 && <ParentStep />}

            {step === 2 && (
              <AcademicStep
                classes={classes}
                academicYear={academicYear}
                feeStructures={feeStructures}
              />
            )}

            {step === 3 && <DocumentsStep />}

            {step === 4 && (
              <ReviewStep
                classes={classes}
                academicYear={academicYear}
                feeStructures={feeStructures}
                confirmed={reviewConfirmed}
                onConfirmChange={setReviewConfirmed}
              />
            )}
          </div>

          <div className="sticky bottom-0 z-20 rounded-b-xl border-x border-b border-slate-200 bg-white px-6 py-3">
            <WizardNavigation
              currentStep={step}
              totalSteps={STEPS.length}
              onPrevious={previous}
              onNext={next}
              onSubmit={submit}
              loading={isPending}
              canSubmit={reviewConfirmed}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
