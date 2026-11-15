import "server-only";
import { Day } from "@prisma/client";
import { MeetingApiError } from "./zoom";

// Microsoft Teams through Microsoft Graph. An Entra ID app with the
// Calendars.ReadWrite application permission (admin consented) creates a
// weekly Teams meeting in the calendar of MS_ORGANIZER_EMAIL, a licensed
// school mailbox. The teacher is invited so it shows in their Outlook.

export const teamsConfigured = () =>
  !!(
    process.env.MS_TENANT_ID &&
    process.env.MS_CLIENT_ID &&
    process.env.MS_CLIENT_SECRET &&
    process.env.MS_ORGANIZER_EMAIL
  );

let cachedToken: { value: string; expiresAt: number } | null = null;

const getToken = async () => {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(
      process.env.MS_TENANT_ID!
    )}/oauth2/v2.0/token`,
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.MS_CLIENT_ID!,
        client_secret: process.env.MS_CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
      }),
    }
  );
  if (!res.ok) {
    throw new MeetingApiError(
      "Microsoft rejected the app credentials. Check MS_TENANT_ID, MS_CLIENT_ID and MS_CLIENT_SECRET (secrets expire)."
    );
  }
  const body = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000,
  };
  return body.access_token;
};

const graphFetch = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok && res.status !== 404) {
    const detail = await res.text();
    console.log("Graph API error", res.status, detail);
    throw new MeetingApiError(
      res.status === 401 || res.status === 403
        ? "The Microsoft app needs the Calendars.ReadWrite application permission with admin consent."
        : `Microsoft returned an error (${res.status}). Check MS_ORGANIZER_EMAIL is a licensed mailbox and try again.`
    );
  }
  return res;
};

const organizer = () => encodeURIComponent(process.env.MS_ORGANIZER_EMAIL!);

const DAY_INDEX: Record<Day, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
};

// The next calendar date (YYYY-MM-DD) that falls on the given weekday
const nextDateOn = (day: Day) => {
  const d = new Date();
  d.setDate(d.getDate() + ((DAY_INDEX[day] - d.getDay() + 7) % 7));
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("-");
};

export const createTeamsMeeting = async ({
  subject,
  description,
  day,
  startTime,
  endTime,
  timeZone,
  teacherEmail,
}: {
  subject: string;
  description: string;
  day: Day;
  startTime: string; // "HH:MM" in timeZone
  endTime: string;
  timeZone: string; // IANA name, e.g. Africa/Johannesburg
  teacherEmail?: string | null;
}) => {
  const date = nextDateOn(day);
  const res = await graphFetch(`/users/${organizer()}/events`, {
    method: "POST",
    body: JSON.stringify({
      subject: subject.slice(0, 255),
      body: { contentType: "text", content: description },
      start: { dateTime: `${date}T${startTime}:00`, timeZone },
      end: { dateTime: `${date}T${endTime}:00`, timeZone },
      recurrence: {
        pattern: {
          type: "weekly",
          interval: 1,
          daysOfWeek: [day.toLowerCase()],
          firstDayOfWeek: "monday",
        },
        range: { type: "noEnd", startDate: date },
      },
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness",
      allowNewTimeProposals: false,
      ...(teacherEmail && {
        attendees: [{ emailAddress: { address: teacherEmail }, type: "required" }],
      }),
    }),
  });

  let event = (await res.json()) as {
    id: string;
    onlineMeeting?: { joinUrl?: string } | null;
  };

  // Graph sometimes fills in the join link a moment after creating the event
  for (let i = 0; i < 3 && !event.onlineMeeting?.joinUrl; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const again = await graphFetch(
      `/users/${organizer()}/events/${encodeURIComponent(event.id)}?$select=id,onlineMeeting`
    );
    event = await again.json();
  }
  if (!event.onlineMeeting?.joinUrl) {
    await deleteTeamsMeeting(event.id).catch(() => {});
    throw new MeetingApiError(
      "Microsoft created the event but no Teams link. Check that MS_ORGANIZER_EMAIL has a Teams licence."
    );
  }

  return { externalId: event.id, joinUrl: event.onlineMeeting.joinUrl, passcode: null };
};

export const deleteTeamsMeeting = async (externalId: string) => {
  await graphFetch(`/users/${organizer()}/events/${encodeURIComponent(externalId)}`, {
    method: "DELETE",
  });
};

export const testTeams = async () => {
  await graphFetch(`/users/${organizer()}/calendar?$select=id`);
};
