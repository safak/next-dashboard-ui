"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "./auth";
import {
  deleteRemoteMeeting,
  integrationStatus,
  providerFromUrl,
  schoolTimeZone,
  timeOfDay,
} from "./meetings";
import { createTeamsMeeting, testTeams } from "./meetings/teams";
import {
  createZoomMeeting,
  getZoomStartUrl,
  MeetingApiError,
  testZoom,
} from "./meetings/zoom";
import prisma from "./prisma";

type MeetingState = { success: boolean; error: boolean; message?: string };

const fail = (message: string): MeetingState => ({ success: false, error: true, message });

const targetSchema = z.object({
  kind: z.enum(["lesson", "extraClass"]),
  id: z.coerce.number().int().positive(),
});
export type MeetingTarget = z.input<typeof targetSchema>;

const dayLabel = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

// Everything needed to create a meeting for a lesson or extra class, or
// null when it doesn't exist or the user may not manage it
const loadTarget = async (input: MeetingTarget) => {
  const parsed = targetSchema.safeParse(input);
  if (!parsed.success) return null;
  const { kind, id } = parsed.data;
  const { userId, role } = await auth();
  if (!userId) return null;

  const teacher = { select: { email: true, name: true, surname: true } };
  const item =
    kind === "lesson"
      ? await prisma.lesson
          .findUnique({
            where: { id },
            include: {
              subject: { select: { name: true } },
              class: { select: { name: true } },
              teacher,
              meeting: true,
            },
          })
          .then(
            (l) =>
              l && {
                teacherId: l.teacherId,
                teacher: l.teacher,
                meeting: l.meeting,
                day: l.day,
                startTime: timeOfDay(l.startTime),
                endTime: timeOfDay(l.endTime),
                title: `${l.subject.name} – Class ${l.class.name}`,
              }
          )
      : await prisma.extraClass
          .findUnique({
            where: { id },
            include: { subject: { select: { name: true } }, teacher, meeting: true },
          })
          .then(
            (e) =>
              e && {
                teacherId: e.teacherId,
                teacher: e.teacher,
                meeting: e.meeting,
                day: e.day,
                startTime: e.startTime,
                endTime: e.endTime,
                title: `${e.name} (${e.subject.name} extra class)`,
              }
          );

  if (!item) return null;
  if (role !== "admin" && !(role === "teacher" && item.teacherId === userId)) {
    return null;
  }
  return { ...item, kind, id, userId };
};

const NOT_FOUND = "You can't manage the meeting for this class.";

const revalidate = () => {
  revalidatePath("/list/lessons");
  revalidatePath("/list/extra-classes");
};

const linkFields = (t: { kind: "lesson" | "extraClass"; id: number }) =>
  t.kind === "lesson" ? { lessonId: t.id } : { extraClassId: t.id };

export const createMeeting = async (
  _state: MeetingState,
  input: { target: MeetingTarget; provider: "ZOOM" | "TEAMS" }
): Promise<MeetingState> => {
  const t = await loadTarget(input.target);
  if (!t) return fail(NOT_FOUND);
  if (t.meeting) return fail("This class already has a meeting. Remove it first.");

  const status = integrationStatus();
  if (input.provider === "ZOOM" && !status.zoom) {
    return fail("Zoom isn't connected yet. Ask an admin to add the Zoom keys.");
  }
  if (input.provider === "TEAMS" && !status.teams) {
    return fail("Microsoft Teams isn't connected yet. Ask an admin to add the Microsoft keys.");
  }

  const schedule = `Every ${dayLabel(t.day)}, ${t.startTime}–${t.endTime}`;
  const teacherName = `${t.teacher.name} ${t.teacher.surname}`;

  let created: { externalId: string; joinUrl: string; passcode: string | null };
  try {
    created =
      input.provider === "ZOOM"
        ? await createZoomMeeting({
            topic: t.title,
            agenda: `${schedule}. Teacher: ${teacherName}.`,
            teacherEmail: t.teacher.email,
          })
        : await createTeamsMeeting({
            subject: t.title,
            description: `Teacher: ${teacherName}. Created by the school app; students join from their dashboard.`,
            day: t.day,
            startTime: t.startTime,
            endTime: t.endTime,
            timeZone: schoolTimeZone(),
            teacherEmail: t.teacher.email,
          });
  } catch (err) {
    console.log(err);
    return fail(
      err instanceof MeetingApiError
        ? err.message
        : "Couldn't reach Zoom/Microsoft. Check the internet connection and try again."
    );
  }

  try {
    await prisma.onlineMeeting.create({
      data: {
        provider: input.provider,
        ...created,
        ...linkFields(t),
        createdById: t.userId,
      },
    });
  } catch (err) {
    // Don't leave an orphaned meeting behind in Zoom/Teams
    await deleteRemoteMeeting({ provider: input.provider, externalId: created.externalId }).catch(
      () => {}
    );
    console.log(err);
    return fail("The meeting couldn't be saved. Please try again.");
  }

  revalidate();
  return { success: true, error: false };
};

export const saveMeetingLink = async (
  _state: MeetingState,
  input: { target: MeetingTarget; url: string; passcode?: string }
): Promise<MeetingState> => {
  const t = await loadTarget(input.target);
  if (!t) return fail(NOT_FOUND);
  if (t.meeting) return fail("This class already has a meeting. Remove it first.");

  let url: URL;
  try {
    url = new URL(input.url.trim());
  } catch {
    return fail("Paste the full meeting link, starting with https://");
  }
  if (url.protocol !== "https:") return fail("Meeting links must start with https://");

  await prisma.onlineMeeting.create({
    data: {
      provider: providerFromUrl(url),
      joinUrl: url.toString(),
      passcode: input.passcode?.trim() || null,
      ...linkFields(t),
      createdById: t.userId,
    },
  });

  revalidate();
  return { success: true, error: false };
};

export const removeMeeting = async (
  _state: MeetingState,
  input: { target: MeetingTarget }
): Promise<MeetingState> => {
  const t = await loadTarget(input.target);
  if (!t) return fail(NOT_FOUND);
  if (!t.meeting) return { success: true, error: false };

  try {
    await deleteRemoteMeeting(t.meeting);
  } catch (err) {
    console.log(err);
    return fail(
      err instanceof MeetingApiError
        ? `${err.message} The link was kept so nothing is lost.`
        : "Couldn't remove the meeting from Zoom/Teams. Please try again."
    );
  }

  await prisma.onlineMeeting.delete({ where: { id: t.meeting.id } });
  revalidate();
  return { success: true, error: false };
};

// Opens the meeting in Zoom as host, with a host link fetched just now
export const startZoomAsHost = async (formData: FormData) => {
  const kind = String(formData.get("kind"));
  const id = String(formData.get("id"));
  const t = await loadTarget({ kind: kind as MeetingTarget["kind"], id });
  if (!t?.meeting || t.meeting.provider !== "ZOOM" || !t.meeting.externalId) {
    redirect(kind === "lesson" ? "/list/lessons" : "/list/extra-classes");
  }
  const startUrl = await getZoomStartUrl(t.meeting.externalId);
  redirect(startUrl);
};

export const testIntegrations = async () => {
  const { role } = await auth();
  if (role !== "admin") return null;

  const status = integrationStatus();
  const check = async (configured: boolean, test: () => Promise<void>) => {
    if (!configured) return "Not connected";
    try {
      await test();
      return "Working";
    } catch (err) {
      return err instanceof MeetingApiError ? err.message : "Couldn't reach the service.";
    }
  };

  return {
    zoom: await check(status.zoom, testZoom),
    teams: await check(status.teams, testTeams),
  };
};
