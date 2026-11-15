import ListControls from "@/components/ListControls";
import { resolveOrderBy, SortMap, sortOptions, toOptions } from "@/lib/listQuery";
import { Day } from "@prisma/client";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, OnlineMeeting, Prisma, Subject, Teacher } from "@prisma/client";
import MeetingButton from "@/components/MeetingButton";
import { integrationStatus } from "@/lib/meetings";
import Image from "next/image";
import { auth } from "@/lib/auth";

type LessonList = Lesson & { subject: Subject } & { class: Class } & {
  teacher: Teacher;
  meeting: OnlineMeeting | null;
};


const SORTS: SortMap<Prisma.LessonOrderByWithRelationInput> = {
  subject: { label: "Subject", orderBy: { subject: { name: "asc" } } },
  class: { label: "Class", orderBy: { class: { name: "asc" } } },
  teacher: { label: "Teacher", orderBy: { teacher: { name: "asc" } } },
};

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {

const { userId, role } = await auth();
const integrations = integrationStatus();
const canManageMeeting = (item: LessonList) =>
  role === "admin" || (role === "teacher" && item.teacherId === userId);


const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: LessonList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
    <td>{item.class.name}</td>
    <td className="hidden md:table-cell">
      {item.teacher.name + " " + item.teacher.surname}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {canManageMeeting(item) && (
          <MeetingButton
            target={{ kind: "lesson", id: item.id }}
            title={`${item.subject.name} · Class ${item.class.name}`}
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
        )}
        {role === "admin" && (
          <>
            <FormContainer table="lesson" type="update" data={item} />
            <FormContainer table="lesson" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId = parseInt(value);
            break;
          case "teacherId":
            query.teacherId = value;
            break;
          case "subjectId":
            query.subjectId = parseInt(value);
            break;
          case "day":
            query.day = value as Day;
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value } } },
              { teacher: { name: { contains: value } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      orderBy: resolveOrderBy(SORTS, queryParams.sort),
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true } },
        meeting: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  const [classes, subjects, teachers] = await Promise.all([prisma.class.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }), prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }), prisma.teacher.findMany({ select: { id: true, name: true, surname: true }, orderBy: { name: "asc" } })]);

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls
              filters={[
                { key: "classId", label: "Class", options: toOptions(classes, (c) => c.name) },
                { key: "subjectId", label: "Subject", options: toOptions(subjects, (s) => s.name) },
                { key: "teacherId", label: "Teacher", options: toOptions(teachers, (t) => `${t.name} ${t.surname}`) },
                {
                  key: "day",
                  label: "Day",
                  options: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map((d) => ({
                    value: d,
                    label: d.charAt(0) + d.slice(1).toLowerCase(),
                  })),
                },
              ]}
              sorts={sortOptions(SORTS)}
            />
            {role === "admin" && <FormContainer table="lesson" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonListPage;
