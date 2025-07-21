import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getUserSessionInfo } from "@/lib/session";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamListPage = async ({
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

  const lessonQuery: Prisma.LessonWhereInput = {};
  const examQuery: Prisma.ExamWhereInput = {
    lesson: lessonQuery,
  };

  // 🔍 Recherche via URL params
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "classId":
          lessonQuery.classId = parseInt(value);
          break;
        case "teacherId":
          lessonQuery.teacherId = value;
          break;
        case "search":
          examQuery.title = {
            contains: value,
            //mode: "insensitive",
          };

          // Facultatif : Recherche aussi sur la matière (subject.name)
          // lessonQuery.subject = {
          //   name: {
          //     contains: value,
          //     mode: "insensitive",
          //   },
          // };
          break;
        default:
          break;
      }
    }
  }

  // 🔐 Filtrage par rôle
  switch (role) {
    case "teacher":
      lessonQuery.teacherId = currentUserId.toString();
      break;
    case "student":
      lessonQuery.class = {
        students: {
          some: {
            id: currentUserId.toString(),
          },
        },
      };
      break;
    case "parent":
      lessonQuery.class = {
        students: {
          some: {
            parentId: currentUserId.toString(),
          },
        },
      };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: examQuery,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: examQuery }),
  ]);

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
      accessor: "teacher",
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
      : []),
  ];

  const renderRow = (item: ExamList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-kalasaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="exam" type="update" data={item} />
              <FormContainer table="exam" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
              <Image
                src="/uploads/filter.png"
                width={14}
                height={14}
                alt=""
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
              <Image src="/uploads/sors.png" width={14} height={14} alt="" />
            </button>
            {role === "admin" && (
              <FormContainer table="exam" type="create" />
            )}
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

export default ExamListPage;
