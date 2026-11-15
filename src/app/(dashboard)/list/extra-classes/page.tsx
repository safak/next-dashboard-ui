import ExtraClassRegisterButton from "@/components/ExtraClassRegisterButton";
import FormContainer from "@/components/FormContainer";
import ListControls from "@/components/ListControls";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resolveOrderBy, SortMap, sortOptions, toOptions } from "@/lib/listQuery";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Day, ExtraClass, OnlineMeeting, Prisma, Subject, Teacher } from "@prisma/client";
import MeetingButton from "@/components/MeetingButton";
import { providerLabels, VideoIcon } from "@/components/meetingUi";
import { integrationStatus } from "@/lib/meetings";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

type ExtraClassList = ExtraClass & {
  subject: Subject;
  teacher: Teacher;
  _count: { registrations: number };
  meeting: OnlineMeeting | null;
  registrations?: { id: number }[];
};

const SORTS: SortMap<Prisma.ExtraClassOrderByWithRelationInput> = {
  name: { label: "Name (A–Z)", orderBy: { name: "asc" } },
  subject: { label: "Subject", orderBy: { subject: { name: "asc" } } },
  newest: { label: "Newest first", orderBy: { createdAt: "desc" } },
};

const DAYS: Day[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const dayLabel = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

const ExtraClassListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, role } = await auth();
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  // Whose registrations the Register buttons act on
  let children: { id: string; name: string; surname: string }[] = [];
  let studentId: string | null = null;
  if (role === "student") {
    studentId = userId;
  } else if (role === "parent") {
    children = await prisma.student.findMany({
      where: { parentId: userId! },
      select: { id: true, name: true, surname: true },
      orderBy: { name: "asc" },
    });
    studentId =
      children.find((c) => c.id === queryParams.studentId)?.id ??
      children[0]?.id ??
      null;
  }

  const query: Prisma.ExtraClassWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    switch (key) {
      case "subjectId":
        query.subjectId = parseInt(value);
        break;
      case "teacherId":
        query.teacherId = value;
        break;
      case "day":
        query.day = value as Day;
        break;
      case "mine":
        if (role === "teacher") query.teacherId = userId!;
        else if (studentId) query.registrations = { some: { studentId } };
        break;
      case "search":
        query.OR = [
          { name: { contains: value } },
          { subject: { name: { contains: value } } },
        ];
        break;
      default:
        break;
    }
  }

  const [data, count, subjects, teachers] = await Promise.all([
    prisma.extraClass.findMany({
      where: query,
      include: {
        subject: true,
        teacher: true,
        meeting: true,
        _count: { select: { registrations: true } },
        ...(studentId && {
          registrations: { where: { studentId }, select: { id: true } },
        }),
      },
      orderBy: resolveOrderBy(SORTS, queryParams.sort) ?? [
        { subject: { name: "asc" } },
        { name: "asc" },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.extraClass.count({ where: query }),
    prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.teacher.findMany({
      where: { extraClasses: { some: {} } },
      select: { id: true, name: true, surname: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const canManage = (item: ExtraClassList) =>
    role === "admin" || (role === "teacher" && item.teacherId === userId);
  const canCreate = role === "admin" || role === "teacher";
  const integrations = integrationStatus();

  const columns = [
    { header: "Class", accessor: "name" },
    { header: "Subject", accessor: "subject" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "When", accessor: "when", className: "hidden md:table-cell" },
    { header: "Seats", accessor: "seats" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: ExtraClassList) => {
    const taken = item._count.registrations;
    const full = taken >= item.capacity;
    const registered = (item.registrations?.length ?? 0) > 0;

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="p-4">
          <div className="font-semibold flex items-center gap-2">
            {item.name}
            {registered && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                Registered
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-gray-500 truncate max-w-[40ch]">
              {item.description}
            </p>
          )}
        </td>
        <td>{item.subject.name}</td>
        <td className="hidden md:table-cell">
          {item.teacher.name} {item.teacher.surname}
        </td>
        <td className="hidden md:table-cell">
          {dayLabel(item.day)} {item.startTime}–{item.endTime}
        </td>
        <td>
          <span className={full ? "font-medium text-red-600" : ""}>
            {taken}/{item.capacity}
          </span>
          {full && <span className="ml-1 text-xs text-red-600">full</span>}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {registered && item.meeting && (
              <a
                href={item.meeting.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Join on ${providerLabels[item.meeting.provider]}`}
                className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-green-600"
              >
                <VideoIcon className="w-3.5 h-3.5" />
                Join
              </a>
            )}
            {studentId && (
              <ExtraClassRegisterButton
                extraClassId={item.id}
                studentId={studentId}
                registered={registered}
                full={full}
              />
            )}
            {canManage(item) && (
              <>
                <Link
                  href={`/list/extra-classes/${item.id}`}
                  title="View roster"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky transition hover:brightness-95"
                >
                  <Image src="/view.png" alt="" width={16} height={16} />
                </Link>
                <MeetingButton
                  target={{ kind: "extraClass", id: item.id }}
                  title={`${item.name} · ${item.subject.name}`}
                  meeting={
                    item.meeting && {
                      provider: item.meeting.provider,
                      joinUrl: item.meeting.joinUrl,
                      passcode: item.meeting.passcode,
                      managed: !!item.meeting.externalId,
                    }
                  }
                  integrations={integrations}
                />
                <FormContainer table="extraClass" type="update" data={item} />
                <FormContainer table="extraClass" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const filters = [
    { key: "subjectId", label: "Subject", options: toOptions(subjects, (s) => s.name) },
    {
      key: "teacherId",
      label: "Teacher",
      options: toOptions(teachers, (t) => `${t.name} ${t.surname}`),
    },
    { key: "day", label: "Day", options: DAYS.map((d) => ({ value: d, label: dayLabel(d) })) },
    ...(role === "teacher" || studentId
      ? [
          {
            key: "mine",
            label: "Show",
            options: [
              {
                value: "1",
                label: role === "teacher" ? "Classes I teach" : "Registered only",
              },
            ],
          },
        ]
      : []),
  ];

  const childLink = (id: string) => {
    const params = new URLSearchParams(
      Object.entries(queryParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("studentId", id);
    return `/list/extra-classes?${params}`;
  };

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-semibold">Extra Classes</h1>
          {studentId && (
            <p className="text-xs text-gray-500">
              Pick the subjects you want extra help in and register for a class.
            </p>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls filters={filters} sorts={sortOptions(SORTS)} />
            {canCreate && <FormContainer table="extraClass" type="create" />}
          </div>
        </div>
      </div>

      {role === "parent" && children.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Registering for:</span>
          {children.map((c) => (
            <Link
              key={c.id}
              href={childLink(c.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                c.id === studentId
                  ? "bg-lamaSkyLight font-medium text-gray-900"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {c.name} {c.surname}
            </Link>
          ))}
        </div>
      )}
      {role === "parent" && children.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          No students are linked to your account, so you can&apos;t register anyone yet.
        </p>
      )}

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExtraClassListPage;
