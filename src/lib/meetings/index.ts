import "server-only";
import { MeetingProvider } from "@prisma/client";
import { deleteTeamsMeeting, teamsConfigured } from "./teams";
import { deleteZoomMeeting, zoomConfigured } from "./zoom";

export { teamsConfigured, zoomConfigured };

// Lesson times are stored as instants; timetables are read in the school's
// time zone (SCHOOL_TIMEZONE, else the server's own)
export const schoolTimeZone = () =>
  process.env.SCHOOL_TIMEZONE || Intl.DateTimeFormat().resolvedOptions().timeZone;

export const timeOfDay = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: schoolTimeZone(),
  }).format(d);

export const integrationStatus = () => ({
  zoom: zoomConfigured(),
  teams: teamsConfigured(),
});

// Removes the meeting from Zoom/Teams as well. A meeting already gone there
// is fine; if the integration has since been switched off, the link is
// simply dropped from this app.
export const deleteRemoteMeeting = async (meeting: {
  provider: MeetingProvider;
  externalId: string | null;
}) => {
  if (!meeting.externalId) return;
  if (meeting.provider === "ZOOM" && zoomConfigured()) {
    await deleteZoomMeeting(meeting.externalId);
  } else if (meeting.provider === "TEAMS" && teamsConfigured()) {
    await deleteTeamsMeeting(meeting.externalId);
  }
};

export const providerFromUrl = (url: URL): MeetingProvider =>
  /(^|\.)zoom\.us$/.test(url.hostname)
    ? "ZOOM"
    : /(^|\.)teams\.(microsoft|live)\.com$/.test(url.hostname)
    ? "TEAMS"
    : "OTHER";
