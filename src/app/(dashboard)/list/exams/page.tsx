import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/utils";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type ExamList = Exam & {
  lesson:{
    subject: Subject;
    class: Class;
    teacher: Teacher;
  }
} ;
const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "Teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
  ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : [])
  ];
    const renderRow = (item:ExamList) => [
         <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-kalasaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td>{item.lesson.class.name}</td>
        <td className="hidden md:table-cell">{item.lesson.teacher.name +" "+item.lesson.teacher.surname}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
    <td>
        <div className="flex items-center gap-2">
           {(role === "admin" || role ==="teacher" ) &&( 
           <>
            <FormContainer table="exam" type="update" data={item} />
            <FormContainer table="exam" type="delete" id={item.id} />
           </>
         )}
        </div>
      </td>
    </tr>
    ];
const ExamListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedParams = await searchParams;
  const { page, ...queryParams } = resolvedParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ExamWhereInput = {
    lesson: {},
  };
  // URL PARAMS CONDITION
  query.lesson = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value)
            break;
            case "teacherId":
            query.lesson.teacherId = value
            break;
          case "search":
             query.lesson.subject= {
                name: {contains: value }
              }
            break;
          default:
            break;
        }
      }
    }
  }
// ROLE CONDITIONS

   switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId.toLocaleString()!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId.toLocaleString()!,
          },
        },
      };
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId.toLocaleString()!,
          },
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson :{
         select: {
          subject: {select: {name: true}},
          teacher: {select: {name: true, surname: true}},
          class: {select: {name: true}}
         } 
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);
return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                    <Image src="/uploads/filter.png" width={14} height={14} alt=""/>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                    <Image src="/uploads/sors.png" width={14} height={14} alt=""/>
                </button>
                {role === "admin" && (
                 <FormContainer table="exam" type="create"/>
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

export default ExamListPage;