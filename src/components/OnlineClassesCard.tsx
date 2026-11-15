import { Day, MeetingProvider, Prisma } from "@prisma/client";
import { startZoomAsHost } from "@/lib/meetingActions";
import { timeOfDay } from "@/lib/meetings";
import prisma from "@/lib/prisma";
import { providerLabels, VideoIcon } from "./meetingUi";

type Row = {
  key: string;
  kind: "lesson" | "extraClass";
  id: number;
  title: string;
  detail?: string;
  day: Day;
  start: string;
  end: string;
  provider: MeetingProvider;
  joinUrl: string;
  passcode: string | null;
  hostable: boolean;
};

const DAY_ORDER: Day[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const dayLabel = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

const lessonInclude = {
  subject: { select: { name: true } },
  class: { select: { name: true } },
  meeting: true,
} satisfies Prisma.LessonInclude;

const extraInclude = {
  subject: { select: { name: true } },
  meeting: true,
} satisfies Prisma.ExtraClassInclude;

// The week's lessons and extra classes that have a Zoom/Teams meeting, for
// a student (their class + registrations), parent (their children's) or
// teacher (what they teach)
const OnlineClassesCard = async ({
  role,
  userId,
}: {
  role: "student" | "parent" | "teacher";
  userId: string;
}) => {
  const hasMeeting = { meeting: { isNot: null } };

  const studentIds =
    role === "student"
      ? [userId]
      : role === "parent"
      ? (await prisma.student.findMany({ where: { parentId: userId }, select: { id: true } })).map(
          (s) => s.id
        )
      : [];

  const [lessons, extras] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        ...hasMeeting,
        ...(role === "teacher"
          ? { teacherId: userId }
          : { class: { students: { some: { id: { in: studentIds } } } } }),
      },
      include: lessonInclude,
    }),
    prisma.extraClass.findMany({
      where: {
        ...hasMeeting,
        ...(role === "teacher"
          ? { teacherId: userId }
          : { registrations: { some: { studentId: { in: studentIds } } } }),
      },
      include: extraInclude,
    }),
  ]);

  const rows: Row[] = [
    ...lessons.map((l) => ({
      key: `l${l.id}`,
      kind: "lesson" as const,
      id: l.id,
      title: l.subject.name,
      detail: `Class ${l.class.name}`,
      day: l.day,
      start: timeOfDay(l.startTime),
      end: timeOfDay(l.endTime),
      provider: l.meeting!.provider,
      joinUrl: l.meeting!.joinUrl,
      passcode: l.meeting!.passcode,
      hostable: role === "teacher" && l.meeting!.provider === "ZOOM" && !!l.meeting!.externalId,
    })),
    ...extras.map((e) => ({
      key: `e${e.id}`,
      kind: "extraClass" as const,
      id: e.id,
      title: e.name,
      detail: `${e.subject.name} extra class`,
      day: e.day,
      start: e.startTime,
      end: e.endTime,
      provider: e.meeting!.provider,
      joinUrl: e.meeting!.joinUrl,
      passcode: e.meeting!.passcode,
      hostable: role === "teacher" && e.meeting!.provider === "ZOOM" && !!e.meeting!.externalId,
    })),
  ].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.start.localeCompare(b.start)
  );

  return (
    <div className="card p-4 flex flex-col gap-3">
      <h1 className="text-xl font-semibold">Online classes</h1>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">
          {role === "teacher"
            ? "None of your classes has a Zoom or Teams meeting yet. Add one with the camera button on the Lessons or Extra Classes page."
            : "No online classes yet. When a teacher adds a Zoom or Teams meeting, a Join button appears here."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.key} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.title}</p>
                <p className="text-xs text-gray-500">
                  {dayLabel(r.day)} {r.start}–{r.end}
                  {r.detail && ` · ${r.detail}`} · {providerLabels[r.provider]}
                  {r.passcode && ` · passcode ${r.passcode}`}
                </p>
              </div>
              {r.hostable ? (
                <form action={startZoomAsHost}>
                  <input type="hidden" name="kind" value={r.kind} />
                  <input type="hidden" name="id" value={String(r.id)} />
                  <button className="flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-600">
                    <VideoIcon className="w-3.5 h-3.5" />
                    Start
                  </button>
                </form>
              ) : (
                <a
                  href={r.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-600"
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  Join
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnlineClassesCard;
