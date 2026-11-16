import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddVideoForm, PlaylistDelete, VideoControls } from "@/components/videos/PlaylistForms";
import { auth } from "@/lib/auth";
import { materialAccessWhere } from "@/lib/materials";
import prisma from "@/lib/prisma";
import { embedUrl, thumbnailUrl, watchUrl } from "@/lib/youtube";

const PlaylistPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}) => {
  const [{ userId, role }, { id }, { v }] = await Promise.all([auth(), params, searchParams]);

  const access = await materialAccessWhere(role, userId);
  const playlistId = parseInt(id);
  const playlist =
    access && Number.isInteger(playlistId)
      ? await prisma.playlist.findFirst({
          where: { AND: [{ id: playlistId }, access] },
          include: {
            subject: { select: { name: true } },
            grade: { select: { level: true } },
            videos: { orderBy: { position: "asc" } },
          },
        })
      : null;
  // Same answer for "doesn't exist" and "not yours"
  if (!playlist) notFound();

  const canManage =
    role === "admin" || (role === "teacher" && playlist.createdById === userId);
  const { videos } = playlist;
  const index = Math.max(0, videos.findIndex((video) => String(video.id) === v));
  const current = videos[index];
  const prev = videos[index - 1];
  const next = videos[index + 1];
  const hrefFor = (videoId: number) => `/list/videos/${playlist.id}?v=${videoId}`;

  return (
    <div className="flex-1 p-4 pt-0 flex flex-col gap-4">
      <div className="card p-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/list/videos" className="text-xs text-indigo-600 hover:underline">
            ← All video lessons
          </Link>
          <h1 className="mt-1 text-lg font-semibold">{playlist.title}</h1>
          <p className="text-xs text-gray-500">
            {playlist.subject.name} · {playlist.grade ? `Grade ${playlist.grade.level}` : "All grades"} ·{" "}
            {videos.length} video{videos.length === 1 ? "" : "s"}
          </p>
          {playlist.description && (
            <p className="mt-2 max-w-3xl text-sm text-gray-600 whitespace-pre-line">{playlist.description}</p>
          )}
        </div>
        {canManage && <PlaylistDelete id={playlist.id} />}
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        {/* PLAYER */}
        <section className="card p-4 xl:flex-1 min-w-0">
          {current ? (
            <>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  key={current.id}
                  src={embedUrl(current.youtubeId)}
                  title={current.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">
                    Video {index + 1} of {videos.length}
                  </p>
                  <h2 className="font-semibold">{current.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {prev && (
                    <Link href={hrefFor(prev.id)} className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200">
                      ← Previous
                    </Link>
                  )}
                  {next && (
                    <Link href={hrefFor(next.id)} className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600">
                      Next video →
                    </Link>
                  )}
                </div>
              </div>
              <a
                href={watchUrl(current.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-gray-500 hover:underline"
              >
                Watch on YouTube instead
              </a>
            </>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-50 text-center text-sm text-gray-500 p-6">
              {canManage
                ? "This playlist is empty. Paste a YouTube link on the right to add the first video."
                : "No videos have been added to this playlist yet."}
            </div>
          )}
        </section>

        {/* VIDEO LIST */}
        <aside className="xl:w-[400px] flex flex-col gap-4">
          {canManage && (
            <section className="card p-4">
              <h2 className="mb-3 text-base font-semibold">Add a video</h2>
              <AddVideoForm playlistId={playlist.id} />
            </section>
          )}
          {videos.length > 0 && (
            <section className="card p-2">
              <ol className="flex flex-col">
                {videos.map((video, i) => (
                  <li
                    key={video.id}
                    className={`flex items-center gap-3 rounded-lg p-2 ${i === index ? "bg-lamaSkyLight" : "hover:bg-gray-50"}`}
                  >
                    <span className="w-5 shrink-0 text-center text-xs text-gray-400">{i + 1}</span>
                    <Link
                      href={hrefFor(video.id)}
                      aria-current={i === index ? "true" : undefined}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <Image
                        src={thumbnailUrl(video.youtubeId)}
                        alt=""
                        width={112}
                        height={63}
                        unoptimized
                        className="h-[63px] w-[112px] shrink-0 rounded-md object-cover bg-gray-100"
                      />
                      <span className={`text-sm line-clamp-2 ${i === index ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {video.title}
                      </span>
                    </Link>
                    {canManage && (
                      <VideoControls
                        id={video.id}
                        title={video.title}
                        first={i === 0}
                        last={i === videos.length - 1}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PlaylistPage;
