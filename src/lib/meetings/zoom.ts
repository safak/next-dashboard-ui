import "server-only";

// Zoom Server-to-Server OAuth app. Meetings are created under one school
// Zoom user (ZOOM_HOST_EMAIL, or the app owner when unset).
// Scopes needed: meeting:write:meeting:admin, meeting:read:meeting:admin,
// meeting:delete:meeting:admin

export const zoomConfigured = () =>
  !!(
    process.env.ZOOM_ACCOUNT_ID &&
    process.env.ZOOM_CLIENT_ID &&
    process.env.ZOOM_CLIENT_SECRET
  );

export class MeetingApiError extends Error {}

let cachedToken: { value: string; expiresAt: number } | null = null;

const getToken = async () => {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const basic = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(
      process.env.ZOOM_ACCOUNT_ID!
    )}`,
    { method: "POST", headers: { Authorization: `Basic ${basic}` } }
  );
  if (!res.ok) {
    throw new MeetingApiError(
      "Zoom rejected the app credentials. Check ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET, and that the app is activated."
    );
  }
  const body = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000,
  };
  return body.access_token;
};

const zoomFetch = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(`https://api.zoom.us/v2${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok && res.status !== 404) {
    const detail = await res.text();
    console.log("Zoom API error", res.status, detail);
    throw new MeetingApiError(
      res.status === 401 || res.status === 403
        ? "The Zoom app is missing permissions. Add the meeting read, write and delete scopes."
        : `Zoom returned an error (${res.status}). Try again later.`
    );
  }
  return res;
};

const hostUser = () => encodeURIComponent(process.env.ZOOM_HOST_EMAIL || "me");

// A recurring meeting with no fixed time: one link that works every week,
// while the timetable itself stays in this app
export const createZoomMeeting = async ({
  topic,
  agenda,
  teacherEmail,
}: {
  topic: string;
  agenda: string;
  teacherEmail?: string | null;
}) => {
  const create = (alternativeHost?: string) =>
    zoomFetch(`/users/${hostUser()}/meetings`, {
      method: "POST",
      body: JSON.stringify({
        topic: topic.slice(0, 200),
        agenda: agenda.slice(0, 2000),
        type: 3,
        settings: {
          waiting_room: true,
          join_before_host: false,
          mute_upon_entry: true,
          ...(alternativeHost && {
            alternative_hosts: alternativeHost,
            alternative_hosts_email_notification: true,
          }),
        },
      }),
    });

  // The teacher can only be an alternative host if they're a licensed user
  // on the school's Zoom account; otherwise create it without them
  let res = teacherEmail ? await create(teacherEmail).catch(() => null) : null;
  if (!res || !res.ok) res = await create();

  const meeting = (await res.json()) as { id: number; join_url: string; password?: string };
  return {
    externalId: String(meeting.id),
    joinUrl: meeting.join_url,
    passcode: meeting.password ?? null,
  };
};

export const deleteZoomMeeting = async (externalId: string) => {
  await zoomFetch(`/meetings/${encodeURIComponent(externalId)}`, { method: "DELETE" });
};

// start_url carries a short-lived host token, so it's fetched fresh each
// time instead of being stored
export const getZoomStartUrl = async (externalId: string) => {
  const res = await zoomFetch(`/meetings/${encodeURIComponent(externalId)}`);
  if (res.status === 404) {
    throw new MeetingApiError("This meeting no longer exists in Zoom. Remove it and create a new one.");
  }
  const meeting = (await res.json()) as { start_url: string };
  return meeting.start_url;
};

export const testZoom = async () => {
  await zoomFetch(`/users/${hostUser()}`);
};
