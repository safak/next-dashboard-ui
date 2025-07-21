import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getUserSessionInfo } from "@/lib/session";
import { Class, Event, Prisma} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventList = Event & { class: Class};
 
const EventListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role,currentUserId } = await getUserSessionInfo();
   
  if (!role || !currentUserId) {
    notFound();
  }
  const resolvedParams = await searchParams;
  const { page, ...queryParams } = resolvedParams;

  // URL PARAMS CONDITION

  const query: Prisma.EventWhereInput = {};

if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, /* mode: "insensitive" */ };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

const roleConditions: { [key: string]: Prisma.ClassWhereInput } = {
  teacher: { lessons: { some: { teacherId: currentUserId! } } },
  student: { students: { some: { id: currentUserId! } } },
  parent: { students: { some: { parentId: currentUserId! } } },
};

// Appliquer au filtre
query.class = {
  is: roleConditions[role as keyof typeof roleConditions] || undefined
};


  const p = page ? parseInt(page) : 1;
  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: query }),
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
      header: "Date",
      accessor: "date",
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
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
      const renderRow = (item:EventList) => [
         <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-kalasaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td>{item.class?.name || "-"}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
        <td className="hidden md:table-cell">
          {item.startTime.toLocaleTimeString("en-US",{
          hour: "2-digit",
          minute:"2-digit",
          hour12: false,
        })}
        </td>
        <td className="hidden md:table-cell">
          {item.endTime.toLocaleTimeString("en-US",{
          hour: "2-digit",
          minute:"2-digit",
          hour12: false,
        })}
        </td>
    <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-kalasaSky">
              <Image src="/uploads/edit.png" alt="" width={16} height={16} />
            </button>
          </Link>
           {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-kalasaPurple">
            <Image src="/uploads/delete.png" alt="" width={16} height={16} />
            </button> 
            //<FormContainer table="teacher" type="delete" id={item.id} />
         )}
        </div>
      </td>
    </tr>
    ];
return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
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
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                    <Image src="/uploads/plus.png" width={14} height={14} alt=""/>
                </button>
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

export default EventListPage;