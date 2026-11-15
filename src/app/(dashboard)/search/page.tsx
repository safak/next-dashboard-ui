import prisma from "@/lib/prisma";
import { routeAccessMap } from "@/lib/settings";
import { classScopedWhere } from "@/lib/visibility";
import { auth } from "@/lib/auth";
import Link from "next/link";

const LIMIT = 5;

type Hit = { key: string | number; href: string; title: string; detail?: string };

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { userId, role: currentRole } = await auth();
  const role = currentRole ?? "";
  const q = ((await searchParams).q ?? "").trim();

  const canSee = (route: string) => routeAccessMap[route]?.includes(role);
  const person = { OR: [{ name: { contains: q } }, { surname: { contains: q } }] };
  const scoped = classScopedWhere(role, userId!);
  const none = Promise.resolve([] as Hit[]);

  const [teachers, students, parents, classes, subjects, events, announcements] =
    q.length === 0
      ? [[], [], [], [], [], [], []]
      : await Promise.all([
          canSee("/list/teachers")
            ? prisma.teacher
                .findMany({ where: person, take: LIMIT })
                .then((rows) =>
                  rows.map((t) => ({
                    key: t.id,
                    href: `/list/teachers/${t.id}`,
                    title: `${t.name} ${t.surname}`,
                    detail: t.email ?? undefined,
                  }))
                )
            : none,
          canSee("/list/students")
            ? prisma.student
                .findMany({ where: person, take: LIMIT, include: { class: true } })
                .then((rows) =>
                  rows.map((s) => ({
                    key: s.id,
                    href: `/list/students/${s.id}`,
                    title: `${s.name} ${s.surname}`,
                    detail: `Class ${s.class.name}`,
                  }))
                )
            : none,
          canSee("/list/parents")
            ? prisma.parent
                .findMany({ where: person, take: LIMIT })
                .then((rows) =>
                  rows.map((p) => ({
                    key: p.id,
                    href: `/list/parents?search=${encodeURIComponent(p.name)}`,
                    title: `${p.name} ${p.surname}`,
                    detail: p.phone,
                  }))
                )
            : none,
          canSee("/list/classes")
            ? prisma.class
                .findMany({ where: { name: { contains: q } }, take: LIMIT })
                .then((rows) =>
                  rows.map((c) => ({
                    key: c.id,
                    href: `/list/students?classId=${c.id}`,
                    title: `Class ${c.name}`,
                    detail: "View students",
                  }))
                )
            : none,
          canSee("/list/subjects")
            ? prisma.subject
                .findMany({ where: { name: { contains: q } }, take: LIMIT })
                .then((rows) =>
                  rows.map((s) => ({
                    key: s.id,
                    href: `/list/subjects?search=${encodeURIComponent(s.name)}`,
                    title: s.name,
                  }))
                )
            : none,
          prisma.event
            .findMany({
              where: { AND: [scoped, { title: { contains: q } }] },
              orderBy: { startTime: "desc" },
              take: LIMIT,
            })
            .then((rows) =>
              rows.map((e) => ({
                key: e.id,
                href: `/list/events?search=${encodeURIComponent(e.title)}`,
                title: e.title,
                detail: new Intl.DateTimeFormat("en-US").format(e.startTime),
              }))
            ),
          prisma.announcement
            .findMany({
              where: { AND: [scoped, { title: { contains: q } }] },
              orderBy: { date: "desc" },
              take: LIMIT,
            })
            .then((rows) =>
              rows.map((a) => ({
                key: a.id,
                href: `/list/announcements?search=${encodeURIComponent(a.title)}`,
                title: a.title,
                detail: new Intl.DateTimeFormat("en-US").format(a.date),
              }))
            ),
        ]);

  const sections: [string, Hit[]][] = [
    ["Teachers", teachers],
    ["Students", students],
    ["Parents", parents],
    ["Classes", classes],
    ["Subjects", subjects],
    ["Events", events],
    ["Announcements", announcements],
  ];
  const found = sections.filter(([, hits]) => hits.length > 0);

  return (
    <div className="card p-6 flex-1 m-4 mt-0 flex flex-col gap-6">
      <form action="/search" role="search" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          autoFocus={!q}
          placeholder="Search people, classes, events..."
          aria-label="Search the school"
          className="form-control max-w-md"
        />
        <button className="btn-primary">Search</button>
      </form>

      {!q ? (
        <p className="text-sm text-gray-500">Type a name or title to search.</p>
      ) : found.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nothing matches &ldquo;{q}&rdquo;.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {found.map(([title, hits]) => (
            <section key={title}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {title}
              </h2>
              <ul className="flex flex-col">
                {hits.map((hit) => (
                  <li key={hit.key}>
                    <Link
                      href={hit.href}
                      className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm transition hover:bg-lamaSkyLight"
                    >
                      <span className="font-medium text-gray-800">{hit.title}</span>
                      {hit.detail && (
                        <span className="text-xs text-gray-400 truncate">
                          {hit.detail}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
