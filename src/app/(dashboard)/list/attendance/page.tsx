import ListControls from "@/components/ListControls";
import { resolveOrderBy, SortMap, sortOptions, toOptions } from "@/lib/listQuery";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Lesson, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import { auth } from "@/lib/auth";

type AttendanceList = Attendance & {
  student: Student;
  lesson: Lesson;
};

const SORTS: SortMap<Prisma.AttendanceOrderByWithRelationInput> = {
  "date-desc": { label: "Latest first", orderBy: { date: "desc" } },
  "date-asc": { label: "Earliest first", orderBy: { date: "asc" } },
  student: { label: "Student", orderBy: { student: { name: "asc" } } },
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const { userId, role } = await auth();
  const currentUserId = userId;
  const canEdit = role === "admin" || role === "teacher";

  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Lesson", accessor: "lesson" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Status", accessor: "status", className: "hidden md:table-cell" },
    ...(canEdit ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">
        {item.student.name} {item.student.surname}
      </td>
      <td>{item.lesson.name}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td className="hidden md:table-cell">
        {item.present ? "Present" : "Absent"}
      </td>
      {canEdit && (
        <td>
          <div className="flex items-center gap-2">
            <FormContainer table="attendance" type="update" data={item} />
            <FormContainer table="attendance" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  const { page, ...queryParams } = resolvedSearchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.AND = [{ lesson: { classId: parseInt(value) } }];
            break;
          case "present":
            query.present = value === "true";
            break;
          case "search":
            query.student = {
              name: { contains: value },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  if (role === "teacher") {
    query.lesson = { teacherId: currentUserId! };
  } else if (role === "student") {
    query.studentId = currentUserId!;
  } else if (role === "parent") {
    query.student = { parentId: currentUserId! };
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      orderBy: resolveOrderBy(SORTS, queryParams.sort) ?? { date: "desc" },
      include: {
        student: true,
        lesson: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);

  const classes = canEdit ? await prisma.class.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [];

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendance</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls
              filters={[
                ...(canEdit ? [{ key: "classId", label: "Class", options: toOptions(classes, (c) => c.name) }] : []),
                {
                  key: "present",
                  label: "Status",
                  options: [
                    { value: "true", label: "Present" },
                    { value: "false", label: "Absent" },
                  ],
                },
              ]}
              sorts={sortOptions(SORTS)}
            />
            {canEdit && <FormContainer table="attendance" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
