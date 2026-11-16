import Image from "next/image";
import Link from "next/link";
import ListControls from "@/components/ListControls";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { PlaylistCreate } from "@/components/videos/PlaylistForms";
import { auth } from "@/lib/auth";
import { resolveOrderBy, SortMap, sortOptions, toOptions } from "@/lib/listQuery";
import { materialAccessWhere } from "@/lib/materials";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { thumbnailUrl } from "@/lib/youtube";
import { Prisma } from "@prisma/client";

const SORTS: SortMap<Prisma.PlaylistOrderByWithRelationInput> = {
  newest: { label: "Newest first", orderBy: { createdAt: "desc" } },
  title: { label: "Title (A–Z)", orderBy: { title: "asc" } },
};

const VideoPlaylistsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, role } = await auth();
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  // Same rules as study materials: learners see their own subjects and grade
  const access = await materialAccessWhere(role, userId);
  const isLearner = role === "student" || role === "parent";
  const canCreate = role === "admin" || role === "teacher";

  const query: Prisma.PlaylistWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    switch (key) {
      case "subjectId":
        query.subjectId = parseInt(value);
        break;
      case "gradeId":
        query.OR = [{ gradeId: parseInt(value) }, { gradeId: null }];
        break;
      case "search":
        query.AND = [
          {
            OR: [
              { title: { contains: value } },
              { description: { contains: value } },
              { videos: { some: { title: { contains: value } } } },
            ],
          },
        ];
        break;
    }
  }
  const where: Prisma.PlaylistWhereInput = { AND: [access ?? { id: -1 }, query] };

  const [data, count, filterSubjects, grades, createSubjects] = await Promise.all([
    prisma.playlist.findMany({
      where,
      include: {
        subject: { select: { name: true } },
        grade: { select: { level: true } },
        videos: { orderBy: { position: "asc" }, take: 1, select: { youtubeId: true } },
        _count: { select: { videos: true } },
      },
      orderBy: resolveOrderBy(SORTS, queryParams.sort) ?? { createdAt: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.playlist.count({ where }),
    prisma.subject.findMany({
      where: isLearner ? { playlists: { some: access ?? { id: -1 } } } : {},
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.grade.findMany({ orderBy: { level: "asc" } }),
    canCreate
      ? prisma.subject.findMany({
          where: role === "teacher" ? { teachers: { some: { id: userId! } } } : {},
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [],
  ]);

  const filters = [
    { key: "subjectId", label: "Subject", options: toOptions(filterSubjects, (s) => s.name) },
    { key: "gradeId", label: "Grade", options: grades.map((g) => ({ value: g.id, label: `Grade ${g.level}` })) },
  ];

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-semibold">Video Lessons</h1>
          <p className="text-xs text-gray-500">
            {role === "student"
              ? "YouTube playlists for the subjects you registered for."
              : role === "parent"
              ? "YouTube playlists for your children's subjects."
              : "Build playlists of YouTube videos for learners to watch."}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls filters={filters} sorts={sortOptions(SORTS)} />
            {canCreate && (
              <PlaylistCreate
                subjects={createSubjects}
                grades={grades.map((g) => ({ id: g.id, name: `Grade ${g.level}` }))}
              />
            )}
          </div>
        </div>
      </div>

      {!access && role === "parent" && (
        <p className="mt-4 text-sm text-gray-500">
          Link your child on your dashboard to see their video lessons.
        </p>
      )}
      {access && count === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          {canCreate ? "No playlists yet. Use the + button to create one." : "No video lessons yet."}
        </p>
      )}

      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((pl) => (
          <li key={pl.id}>
            <Link
              href={`/list/videos/${pl.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="relative aspect-video bg-gray-100">
                {pl.videos[0] ? (
                  <Image
                    src={thumbnailUrl(pl.videos[0].youtubeId)}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                    No videos yet
                  </span>
                )}
                <span className="absolute bottom-2 right-2 rounded-md bg-gray-900/80 px-2 py-0.5 text-xs font-medium text-white">
                  {pl._count.videos} video{pl._count.videos === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600">{pl.title}</h2>
                <p className="text-xs text-gray-500">
                  {pl.subject.name} · {pl.grade ? `Grade ${pl.grade.level}` : "All grades"}
                </p>
                {pl.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{pl.description}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination page={p} count={count} />
    </div>
  );
};

export default VideoPlaylistsPage;
