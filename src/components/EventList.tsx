import prisma from "@/lib/prisma";
import EventCard from "./EventCard";

interface EventListProps {
  dateParam?: string;
}

const EventList = async ({ dateParam }: EventListProps) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const now = new Date();

  // Fetch all events starting today or later
  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: startOfDay,
      },
    },
    orderBy: { startTime: "asc" },
  });

  if (events.length === 0) {
    return <p className="text-gray-500">No events</p>;
  }

  const upcomingEvents = events.filter((e) => new Date(e.startTime) >= now);

  const pastEvents = events.filter(
    (e) =>
      new Date(e.startTime).toDateString() === date.toDateString() &&
      new Date(e.startTime) < now
  );

  return (
    <div className="flex flex-col gap-6">

      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-sm text-gray-800">
            Upcoming Events
          </h3>
          <div className="flex flex-col gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-sm text-gray-800">
            Past Events
          </h3>
          <div className="flex flex-col gap-4 opacity-60">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default EventList;
