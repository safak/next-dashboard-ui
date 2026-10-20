import NotificationDetails from "@/components/mobile/teacher/NotificationDetails";

export default async function NotificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NotificationDetails id={id} />;
}