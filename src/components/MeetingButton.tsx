"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createMeeting,
  MeetingTarget,
  removeMeeting,
  saveMeetingLink,
  startZoomAsHost,
} from "@/lib/meetingActions";
import { providerLabels, VideoIcon } from "./meetingUi";

export type MeetingInfo = {
  provider: "ZOOM" | "TEAMS" | "OTHER";
  joinUrl: string;
  passcode: string | null;
  managed: boolean; // created through the Zoom/Teams API
};

const initial = { success: false, error: false } as {
  success: boolean;
  error: boolean;
  message?: string;
};

// Opens a dialog to add, view or remove the online meeting of a lesson or
// extra class
const MeetingButton = ({
  target,
  title,
  meeting,
  integrations,
}: {
  target: MeetingTarget;
  title: string;
  meeting: MeetingInfo | null;
  integrations: { zoom: boolean; teams: boolean };
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        title={meeting ? `Online meeting (${providerLabels[meeting.provider]})` : "Add online meeting"}
        onClick={() => setOpen(true)}
        className={`w-7 h-7 flex items-center justify-center rounded-full transition hover:brightness-95 ${
          meeting ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        <VideoIcon />
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div role="dialog" aria-modal="true" className="bg-white p-6 rounded-2xl shadow-xl relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold pr-8">Online meeting</h2>
            <p className="text-sm text-gray-500 mb-5">{title}</p>
            {meeting ? (
              <CurrentMeeting target={target} meeting={meeting} />
            ) : (
              <AddMeeting target={target} integrations={integrations} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const useRefreshOnSuccess = (state: typeof initial, message: string) => {
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(message);
      router.refresh();
    }
  }, [state, router, message]);
};

const CurrentMeeting = ({ target, meeting }: { target: MeetingTarget; meeting: MeetingInfo }) => {
  const [state, remove, pending] = useActionState(removeMeeting, initial);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  useRefreshOnSuccess(state, "Meeting removed.");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-gray-50 ring-1 ring-gray-200 p-4 flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-500">{providerLabels[meeting.provider]}</span>
        <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 break-all hover:underline">
          {meeting.joinUrl}
        </a>
        {meeting.passcode && (
          <span className="text-sm text-gray-600">
            Passcode: <span className="font-mono">{meeting.passcode}</span>
          </span>
        )}
        <button
          type="button"
          className="text-xs text-indigo-500 hover:underline self-start"
          onClick={() => navigator.clipboard?.writeText(meeting.joinUrl).then(() => setCopied(true))}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {meeting.provider === "ZOOM" && meeting.managed ? (
          <form action={startZoomAsHost}>
            <input type="hidden" name="kind" value={target.kind} />
            <input type="hidden" name="id" value={String(target.id)} />
            <button className="btn-primary">Start as host</button>
          </form>
        ) : (
          <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open meeting
          </a>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        {!confirming ? (
          <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => setConfirming(true)}>
            Remove meeting
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              {meeting.managed
                ? `This also deletes the meeting in ${providerLabels[meeting.provider]}. Students lose the Join button.`
                : "Students lose the Join button."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                onClick={() => startTransition(() => remove({ target }))}
              >
                {pending ? "Removing..." : "Remove"}
              </button>
              <button type="button" className="text-sm text-gray-500" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {state.error && <p className="text-sm text-red-500 mt-2">{state.message}</p>}
      </div>
    </div>
  );
};

const AddMeeting = ({
  target,
  integrations,
}: {
  target: MeetingTarget;
  integrations: { zoom: boolean; teams: boolean };
}) => {
  const [createState, create, creating] = useActionState(createMeeting, initial);
  const [linkState, saveLink, saving] = useActionState(saveMeetingLink, initial);
  const [provider, setProvider] = useState<"ZOOM" | "TEAMS" | null>(null);
  const [url, setUrl] = useState("");
  const [passcode, setPasscode] = useState("");
  useRefreshOnSuccess(createState, "Meeting created!");
  useRefreshOnSuccess(linkState, "Meeting link saved!");

  const providers = [
    { id: "ZOOM" as const, label: "Create Zoom meeting", ready: integrations.zoom },
    { id: "TEAMS" as const, label: "Create Teams meeting", ready: integrations.teams },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-600">Create automatically</span>
        <div className="flex flex-wrap gap-3">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={!p.ready || creating}
              title={p.ready ? undefined : "Not connected yet. An admin adds the keys under Settings."}
              onClick={() => {
                setProvider(p.id);
                startTransition(() => create({ target, provider: p.id }));
              }}
              className="btn-primary"
            >
              {creating && provider === p.id ? "Creating..." : p.label}
            </button>
          ))}
        </div>
        {!integrations.zoom && !integrations.teams && (
          <p className="text-xs text-gray-400">
            Zoom and Teams aren&apos;t connected yet. You can still paste a link below.
          </p>
        )}
        {createState.error && <p className="text-sm text-red-500">{createState.message}</p>}
      </div>

      <form
        className="flex flex-col gap-2 border-t border-gray-100 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() => saveLink({ target, url, passcode }));
        }}
      >
        <label htmlFor="meeting-url" className="text-xs font-medium text-gray-600">
          Or paste a meeting link
        </label>
        <input
          id="meeting-url"
          type="url"
          required
          placeholder="https://zoom.us/j/... or https://teams.microsoft.com/l/meetup-join/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-control"
        />
        <input
          aria-label="Passcode (optional)"
          placeholder="Passcode (optional)"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="form-control"
        />
        {linkState.error && <p className="text-sm text-red-500">{linkState.message}</p>}
        <button className="btn-primary self-start" disabled={saving || !url}>
          {saving ? "Saving..." : "Save link"}
        </button>
      </form>
    </div>
  );
};

export default MeetingButton;
