import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

import TeacherEvents from "@/components/mobile/teacher/TeacherEvents";

export const dynamic = "force-dynamic";

export default async function TeacherEventsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const classes = await prisma.class.findMany({
    where: {
      supervisorId: userId,
    },
    select: {
      id: true,
    },
  });

  const classIds = classes.map((item) => item.id);

  const events = await prisma.event.findMany({
    where: {
      OR: [
        {
          classId: null,
        },
        ...(classIds.length > 0
          ? [
              {
                classId: {
                  in: classIds,
                },
              },
            ]
          : []),
      ],
    },
    include: {
      class: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const serializedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
    category: event.category,
    className: event.class?.name ?? "All Classes",
  }));

  return <TeacherEvents events={serializedEvents} />;
}
