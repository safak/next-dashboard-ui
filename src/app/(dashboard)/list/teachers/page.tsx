import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { normalizeImageSrc } from "@/lib/utils";
import FormContainer from "@/components/FormContainer";
import { requireAuthOr404 } from "@/lib/protect";
import { getUserSessionInfo } from "@/lib/session";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columnsWithoutActions = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
];

const renderRow = (item: TeacherList, role: string) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-kalasaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={normalizeImageSrc(item.img)}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">
      {item.subjects.map((subject) => subject.name).join(", ")}
    </td>
    <td className="hidden md:table-cell">
      {item.classes.map((classItem) => classItem.name).join(", ")}
    </td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-kalasaSky">
            <Image src="/uploads/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <FormContainer table="teacher" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Protection de la page
  await requireAuthOr404(["admin", "teacher"]);

  // Récupérer info session utilisateur (rôle notamment)
  const { role } = await getUserSessionInfo();

  // Récupérer et nettoyer params
  const resolvedSearchParams = await searchParams;
  const cleanedSearchParams: { [key: string]: string | undefined } = {};
  for (const key in resolvedSearchParams) {
    const value = resolvedSearchParams[key];
    cleanedSearchParams[key] = Array.isArray(value) ? value[0] : value;
  }
  const { page, ...queryParams } = cleanedSearchParams;

  // Construire la query Prisma
  const query: Prisma.TeacherWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = { contains: value /*, mode: "insensitive" */ };
            break;
          default:
            break;
        }
      }
    }
  }

  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  // Ajouter ou non la colonne Actions selon rôle
  const columns = role === "admin" ? [...columnsWithoutActions, { header: "Actions", accessor: "action" }] : columnsWithoutActions;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
              <Image src="/uploads/filter.png" width={14} height={14} alt="" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
              <Image src="/uploads/sort.png" width={14} height={14} alt="" />
            </button>
            {role === "admin" && <FormContainer table="teacher" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={(item: TeacherList) => renderRow(item, role)} data={data} />
      </div>
      {/* PAGINATION */}
      <div>
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default TeacherListPage;
