import AnnouncementDetails from "@/components/mobile/teacher/AnnouncementDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeacherAnnouncementDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  return <AnnouncementDetails announcementId={id} />;
}