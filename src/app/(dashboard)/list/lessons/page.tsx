import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getUserSessionInfo } from "@/lib/session";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type LessonList = Lesson & { subject: Subject } & { class: Class} & {teacher: Teacher} ;



const LessonListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
   const { role, currentUserId } = await getUserSessionInfo();

  if (!role || !currentUserId) {
    notFound();
  }
  const resolvedParams = await searchParams;
  const { page, ...queryParams } = resolvedParams;


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
          case "search":
             query.OR = [
              {subject : {name: { contains: value,/* mode: "insensitive" */ }}},
              {teacher : {name: { contains: value,/* mode: "insensitive" */ }}},
             ] 
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
      include: {
        subject : { select: {name: true}},
        class   : { select: {name: true}},
        teacher : { select: {name: true, surname: true}},
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);
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
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];
    const renderRow = (item:LessonList) => [
         <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-kalasaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
        <td>{item.class.name}</td>
        <td className="hidden md:table-cell">{item.teacher.name +" "+ item.teacher.surname}</td>
    <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-kalasaSky">
              <Image src="/uploads/edit.png" alt="" width={16} height={16} />
            </button>
          </Link>
           {role=== "admin" && (
            <FormModal table="lesson" type="delete" id={item.id} />
         )}
        </div>
      </td>
    </tr>
    ];
return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                    <Image src="/uploads/filter.png" width={14} height={14} alt=""/>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                    <Image src="/uploads/sort.png" width={14} height={14} alt=""/>
                </button>
                {role === "admin" && (
                 <FormModal table="lesson" type="create"/>
                )}
            </div>
        </div>
    </div>
     {/* LIST */}
    <div className="">
        <Table columns={columns} renderRow={renderRow} data={data}/>
    </div>
     {/* PAGINATION */}
    <div className="">
        <Pagination page={p} count={count}/>
    </div>
</div>
)
}

export default LessonListPage;