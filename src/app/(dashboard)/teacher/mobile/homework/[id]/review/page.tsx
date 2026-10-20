import HomeworkReviewPage from "@/components/mobile/teacher/HomeworkReviewPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <HomeworkReviewPage homeworkId={id} />;
}