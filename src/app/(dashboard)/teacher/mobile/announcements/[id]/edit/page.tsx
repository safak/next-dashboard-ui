import EditAnnouncementPage from "@/components/mobile/teacher/EditAnnouncementPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeacherEditAnnouncementPage({
  params,
}: PageProps) {
  const { id } = await params;

  return <EditAnnouncementPage announcementId={id} />;
}