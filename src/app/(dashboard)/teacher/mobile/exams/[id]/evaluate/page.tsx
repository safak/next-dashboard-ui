import ExamEvaluationPage from "@/components/mobile/teacher/ExamEvaluationPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ExamEvaluationPage
      examId={id}
    />
  );
}