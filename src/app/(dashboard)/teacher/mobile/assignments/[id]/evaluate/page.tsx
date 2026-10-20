import AssignmentEvaluationPage from "@/components/mobile/teacher/AssignmentEvaluationPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AssignmentEvaluationPage assignmentId={id} />;
}