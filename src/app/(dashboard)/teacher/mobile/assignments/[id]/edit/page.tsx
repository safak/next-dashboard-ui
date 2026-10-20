import EditAssignmentPage from "@/components/mobile/teacher/EditAssignmentPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditAssignmentPage assignmentId={id} />;
}