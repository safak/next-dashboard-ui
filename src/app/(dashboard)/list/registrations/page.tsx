import ListControls from "@/components/ListControls";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  REGISTRATION_STATUSES as STATUSES,
  registrationStatusLabel as statusLabel,
  registrationStatusStyles as statusStyles,
} from "@/lib/registrationStatus";
import { Prisma, RegistrationStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const RegistrationListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  // Pending ones are what admins come here for, so they're the default
  const status = STATUSES.includes(queryParams.status as RegistrationStatus)
    ? (queryParams.status as RegistrationStatus)
    : "PENDING";

  const query: Prisma.StudentRegistrationWhereInput = { status };
  if (queryParams.gradeId) query.gradeId = parseInt(queryParams.gradeId);
  if (queryParams.search) {
    query.OR = [
      { name: { contains: queryParams.search } },
      { surname: { contains: queryParams.search } },
      { studentNumber: { contains: queryParams.search.toUpperCase() } },
      { username: { contains: queryParams.search } },
    ];
  }

  const [data, count, grades] = await Promise.all([
    prisma.studentRegistration.findMany({
      where: query,
      include: {
        grade: { select: { level: true } },
        parent: { select: { name: true, surname: true } },
      },
      orderBy: { createdAt: status === "PENDING" ? "asc" : "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.studentRegistration.count({ where: query }),
    prisma.grade.findMany({ orderBy: { level: "asc" } }),
  ]);

  type Row = (typeof data)[number];

  const columns = [
    { header: "Applicant", accessor: "name" },
    { header: "Student no.", accessor: "studentNumber", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Parent account", accessor: "parent", className: "hidden lg:table-cell" },
    { header: "Submitted", accessor: "createdAt", className: "hidden lg:table-cell" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: Row) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">
        <div className="font-semibold">
          {item.name} {item.surname}
        </div>
        <p className="text-xs text-gray-500">@{item.username}</p>
      </td>
      <td className="hidden md:table-cell font-mono text-xs">{item.studentNumber}</td>
      <td className="hidden md:table-cell">Grade {item.grade.level}</td>
      <td className="hidden lg:table-cell">
        {item.parent ? `${item.parent.name} ${item.parent.surname}` : (
          <span className="text-gray-400">Not linked yet</span>
        )}
      </td>
      <td className="hidden lg:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(item.createdAt)}
      </td>
      <td>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[item.status]}`}
        >
          {statusLabel(item.status)}
        </span>
      </td>
      <td>
        <Link
          href={`/list/registrations/${item.id}`}
          title={item.status === "PENDING" ? "Review" : "View"}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky transition hover:brightness-95"
        >
          <Image src="/view.png" alt="" width={16} height={16} />
        </Link>
      </td>
    </tr>
  );

  const filters = [
    {
      key: "status",
      label: "Status",
      options: STATUSES.map((s) => ({ value: s, label: statusLabel(s) })),
    },
    {
      key: "gradeId",
      label: "Grade",
      options: grades.map((g) => ({ value: g.id, label: `Grade ${g.level}` })),
    },
  ];

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-semibold">Student Registrations</h1>
          <p className="text-xs text-gray-500">
            Showing {statusLabel(status).toLowerCase()} registrations. Approve
            one to place the student in a class and activate their account.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls filters={filters} sorts={[]} />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default RegistrationListPage;
