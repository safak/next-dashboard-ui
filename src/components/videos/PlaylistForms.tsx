"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  addVideo,
  createPlaylist,
  deletePlaylist,
  moveVideo,
  removeVideo,
} from "@/lib/playlistActions";

type Option = { id: number; name: string };

const initial = { success: false, error: false } as { success: boolean; error: boolean; message?: string };

const label = "text-xs font-medium text-gray-600";

// New playlist button and dialog. Saving opens the new playlist.
export const PlaylistCreate = ({ subjects, grades }: { subjects: Option[]; grades: Option[] }) => {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createPlaylist, initial);

  return (
    <>
      <button
        type="button"
        title="New playlist"
        onClick={() => setOpen(true)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow transition hover:brightness-95"
      >
        <Image src="/create.png" alt="" width={16} height={16} />
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && !pending && setOpen(false)}
        >
          <div role="dialog" aria-modal="true" className="bg-white p-6 rounded-2xl shadow-xl relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">New video playlist</h2>

            {subjects.length === 0 ? (
              <p className="text-sm text-gray-600">
                You aren&apos;t assigned to teach any subject yet, so you can&apos;t
                create playlists. Ask an admin to add you to a subject.
              </p>
            ) : (
              <form action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="p-title" className={label}>Title</label>
                  <input id="p-title" name="title" required maxLength={150} className="form-control" placeholder="e.g. Grade 12 Calculus" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="p-subject" className={label}>Subject</label>
                  <select id="p-subject" name="subjectId" required defaultValue="" className="form-control">
                    <option value="" disabled>Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="p-grade" className={label}>Grade</label>
                  <select id="p-grade" name="gradeId" defaultValue="" className="form-control">
                    <option value="">All grades</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="p-desc" className={label}>
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea id="p-desc" name="description" rows={2} maxLength={1000} className="form-control" placeholder="What learners will find in this playlist" />
                </div>
                {state.error && <p className="sm:col-span-2 text-sm text-red-500">{state.message}</p>}
                <button className="btn-primary sm:col-span-2" disabled={pending}>
                  {pending ? "Creating..." : "Create playlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Paste a YouTube link to add it to the end of the playlist
export const AddVideoForm = ({ playlistId }: { playlistId: number }) => {
  const [state, action, pending] = useActionState(addVideo, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast("Video added!");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="playlistId" value={playlistId} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="v-url" className={label}>YouTube link</label>
        <input
          id="v-url"
          name="url"
          required
          maxLength={500}
          className="form-control"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="v-title" className={label}>
          Title <span className="text-gray-400 font-normal">(optional: taken from YouTube)</span>
        </label>
        <input id="v-title" name="title" maxLength={150} className="form-control" />
      </div>
      {state.error && <p className="text-sm text-red-500">{state.message}</p>}
      <button className="btn-primary" disabled={pending}>
        {pending ? "Adding..." : "Add video"}
      </button>
    </form>
  );
};

const iconButton =
  "w-7 h-7 flex items-center justify-center rounded-full text-xs text-gray-600 bg-gray-100 transition hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100";

// Move up / move down / remove for one video in the playlist
export const VideoControls = ({
  id,
  title,
  first,
  last,
}: {
  id: number;
  title: string;
  first: boolean;
  last: boolean;
}) => {
  const [moveState, move, moving] = useActionState(moveVideo, initial);
  const [removeState, remove, removing] = useActionState(removeVideo, initial);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (moveState.error) toast.error(moveState.message ?? "Couldn't move the video.");
  }, [moveState]);
  useEffect(() => {
    if (removeState.success) toast("Video removed.");
    if (removeState.error) toast.error(removeState.message ?? "Couldn't remove the video.");
  }, [removeState]);

  if (confirming) {
    return (
      <form action={remove} className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <button
          className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
          disabled={removing}
        >
          {removing ? "Removing..." : "Remove"}
        </button>
        <button type="button" className="text-xs text-gray-500" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <form action={move}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button className={iconButton} title={`Move "${title}" up`} disabled={first || moving}>
          ▲
        </button>
      </form>
      <form action={move}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button className={iconButton} title={`Move "${title}" down`} disabled={last || moving}>
          ▼
        </button>
      </form>
      <button
        type="button"
        title={`Remove "${title}"`}
        onClick={() => setConfirming(true)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple transition hover:brightness-95"
      >
        <Image src="/delete.png" alt="" width={14} height={14} />
      </button>
    </div>
  );
};

export const PlaylistDelete = ({ id }: { id: number }) => {
  const [state, action, pending] = useActionState(deletePlaylist, initial);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (state.error) toast.error(state.message ?? "Couldn't delete the playlist.");
  }, [state]);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="text-sm text-red-500 hover:underline">
        Delete playlist
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-3">
      <input type="hidden" name="id" value={id} />
      <span className="text-sm text-gray-600">Delete this playlist and its video list?</span>
      <button
        className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      <button type="button" className="text-xs text-gray-500" onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </form>
  );
};
