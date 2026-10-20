import prisma from "@/lib/prisma";
import EventsDashboard from "./components/EventsDashboard";

export default async function EventsPage() {
  const [events, classes] = await Promise.all([
    prisma.event.findMany({
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    }),

    prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <EventsDashboard
      events={events}
      classes={classes}
    />
  );
}