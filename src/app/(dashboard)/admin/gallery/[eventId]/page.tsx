import GalleryImageManager from "../components/GalleryImageManager";

interface GalleryPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function GalleryEventPage({ params }: GalleryPageProps) {
  const { eventId } = await params;

  return <GalleryImageManager eventId={eventId} />;
}
