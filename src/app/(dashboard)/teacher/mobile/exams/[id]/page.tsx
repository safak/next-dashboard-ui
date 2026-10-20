import ExamDetails from "@/components/mobile/teacher/ExamDetails";

export default async function ExamDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ExamDetails examId={id} />;
}