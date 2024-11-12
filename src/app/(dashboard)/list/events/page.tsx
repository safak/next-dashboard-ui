import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getUserRole } from "@/lib/utils";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

type EventList = Event & {class:Class}
const EventListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const {role, userId} =  await getUserRole();

  
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
   ...(role === "admin" ? [
      {
        header: "Actions",
        accessor: "action",
      }]:[]),
  ];
  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
      <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString("en-US", {hour:"2-digit", minute:"2-digit", hour12:false,})}</td>
      <td className="hidden md:table-cell">{item.endTime.toLocaleTimeString("en-US", {hour:"2-digit", minute:"2-digit", hour12:false,})}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="event" type="update" data={item} />
              <FormContainer table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  //URL PARAMS CONDITION
  const query:Prisma.EventWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {      
          case "search":
            query.title = {contains:value, mode:"insensitive" }  
            break;
          default:
            break;
        };
      }     
      }
  }

  //ROLE CONDITIONS
  // const roleConditions = {
  //   teacher: { lessons: { some: { teacherId: userId! } } },
  //   student: { students: { some: { id: userId! } } },
  //   parent: { students: { some: { parentId: userId! } } },
  // }
  
  // query.OR = [
  //   { classId: null },
  //   {
  //     class:roleConditions[role as keyof typeof roleConditions] || {}
  //   }
  // ]
const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where:query,
      include: {
        class:true, 
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({where:query}),
  ]);  
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*TOP*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-samibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="event" type="create" />}
          </div>
        </div>
      </div>
      {/*LIST*/}
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
      {/*PAGINATION*/}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EventListPage;
