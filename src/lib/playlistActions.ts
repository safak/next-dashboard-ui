"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { playlistSchema, playlistVideoSchema } from "./formValidationSchemas";
import { canUploadFor } from "./materials";
import prisma from "./prisma";
import { MAX_PLAYLIST_VIDEOS, parseYouTubeId, watchUrl } from "./youtube";

type State = { success: boolean; error: boolean; message?: string };

const fail = (message: string): State => ({ success: false, error: true, message });

// Admins manage every playlist; teachers the ones they made
const managedPlaylist = async (playlistId: number) => {
  const { userId, role } = await auth();
  if (!userId || !Number.isInteger(playlistId)) return null;
  const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
  if (!playlist) return null;
  return role === "admin" || (role === "teacher" && playlist.createdById === userId)
    ? playlist
    : null;
};

const refresh = (playlistId?: number) => {
  revalidatePath("/list/videos");
  if (playlistId) revalidatePath(`/list/videos/${playlistId}`);
};

export const createPlaylist = async (_state: State, formData: FormData): Promise<State> => {
  const { userId, role } = await auth();
  if (!userId || (role !== "admin" && role !== "teacher")) {
    return fail("You are not allowed to create playlists.");
  }
  const parsed = playlistSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  const d = parsed.data;
  if (!(await canUploadFor(role, userId, d.subjectId))) {
    return fail("You can only create playlists for subjects you teach.");
  }

  let id: number;
  try {
    ({ id } = await prisma.playlist.create({
      data: {
        title: d.title,
        description: d.description || null,
        subjectId: d.subjectId,
        gradeId: d.gradeId || null,
        createdById: userId,
      },
    }));
  } catch (err) {
    console.log(err);
    return fail("The playlist couldn't be saved. Check the subject and grade.");
  }
  refresh();
  redirect(`/list/videos/${id}`);
};

export const deletePlaylist = async (_state: State, formData: FormData): Promise<State> => {
  const playlist = await managedPlaylist(parseInt(String(formData.get("id"))));
  if (!playlist) return fail("You can't delete this playlist.");
  await prisma.playlist.delete({ where: { id: playlist.id } });
  refresh();
  redirect("/list/videos");
};

// Looks the video up on YouTube, which also tells us whether it exists and
// may be played inside other sites. Only the video link is sent.
const lookUpVideo = async (
  youtubeId: string
): Promise<{ title?: string; problem?: string; offline?: boolean }> => {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl(youtubeId))}`,
      { signal: AbortSignal.timeout(6000), cache: "no-store" }
    );
    if (res.status === 401 || res.status === 403) {
      return { problem: "The owner of that video doesn't allow it to be played outside YouTube." };
    }
    if (!res.ok) return { problem: "That video couldn't be found. It may be private or deleted." };
    const data = (await res.json()) as { title?: string };
    return { title: data.title?.slice(0, 150) };
  } catch {
    return { offline: true };
  }
};

export const addVideo = async (_state: State, formData: FormData): Promise<State> => {
  const parsed = playlistVideoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  const d = parsed.data;

  const playlist = await managedPlaylist(d.playlistId);
  if (!playlist) return fail("You can't change this playlist.");

  const youtubeId = parseYouTubeId(d.url);
  if (!youtubeId) {
    return fail("That isn't a YouTube video link. Copy it from the Share button on YouTube.");
  }

  const count = await prisma.playlistVideo.count({ where: { playlistId: playlist.id } });
  if (count >= MAX_PLAYLIST_VIDEOS) {
    return fail(`A playlist can hold at most ${MAX_PLAYLIST_VIDEOS} videos.`);
  }
  if (await prisma.playlistVideo.findFirst({ where: { playlistId: playlist.id, youtubeId } })) {
    return fail("That video is already in this playlist.");
  }

  const found = await lookUpVideo(youtubeId);
  if (found.problem) return fail(found.problem);
  const title = d.title || found.title;
  if (!title) {
    return fail("YouTube couldn't be reached to look up the title. Type a title and try again.");
  }

  const last = await prisma.playlistVideo.findFirst({
    where: { playlistId: playlist.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  await prisma.playlistVideo.create({
    data: { playlistId: playlist.id, youtubeId, title, position: (last?.position ?? 0) + 1 },
  });
  refresh(playlist.id);
  return { success: true, error: false };
};

const videoOfManagedPlaylist = async (formData: FormData) => {
  const id = parseInt(String(formData.get("id")));
  const video = Number.isInteger(id)
    ? await prisma.playlistVideo.findUnique({ where: { id } })
    : null;
  return video && (await managedPlaylist(video.playlistId)) ? video : null;
};

export const removeVideo = async (_state: State, formData: FormData): Promise<State> => {
  const video = await videoOfManagedPlaylist(formData);
  if (!video) return fail("You can't change this playlist.");
  await prisma.playlistVideo.delete({ where: { id: video.id } });
  refresh(video.playlistId);
  return { success: true, error: false };
};

// Swaps a video with its neighbour above or below
export const moveVideo = async (_state: State, formData: FormData): Promise<State> => {
  const video = await videoOfManagedPlaylist(formData);
  if (!video) return fail("You can't change this playlist.");
  const up = formData.get("direction") === "up";

  const neighbour = await prisma.playlistVideo.findFirst({
    where: {
      playlistId: video.playlistId,
      position: up ? { lt: video.position } : { gt: video.position },
    },
    orderBy: { position: up ? "desc" : "asc" },
  });
  if (!neighbour) return { success: true, error: false };

  await prisma.$transaction([
    prisma.playlistVideo.update({ where: { id: video.id }, data: { position: neighbour.position } }),
    prisma.playlistVideo.update({ where: { id: neighbour.id }, data: { position: video.position } }),
  ]);
  refresh(video.playlistId);
  return { success: true, error: false };
};
