import { notFound } from "next/navigation";

import { getAdmissionDetails } from "@/services/admissions.service";

import AdmissionSuccessCard from "./components/AdmissionSuccessCard";
import StudentSummary from "./components/StudentSummary";
import QuickActions from "./components/AdmissionSuccessActions";

interface Props {
  searchParams: Promise<{
    studentId?: string;
  }>;
}

export default async function AdmissionSuccessPage({
  searchParams,
}: Props) {
  const { studentId } = await searchParams;

  if (!studentId) {
    notFound();
  }

  const admission = await getAdmissionDetails(studentId);

  if (!admission) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <AdmissionSuccessCard admission={admission} />

      <StudentSummary admission={admission} />

      <QuickActions admission={admission} />
    </div>
  );
}