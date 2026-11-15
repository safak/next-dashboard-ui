import ListControls from "@/components/ListControls";
import { resolveOrderBy, SortMap, sortOptions, toOptions } from "@/lib/listQuery";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { DeliveryMode, Prisma, Subject, Teacher } from "@prisma/client";
import { DELIVERY_MODES, deliveryLabels, deliveryStyles } from "@/lib/subjectDelivery";
import Image from "next/image";
import { auth } from "@/lib/auth";

type SubjectList = Subject & { teachers: Teacher[] };

const SORTS: SortMap<Prisma.SubjectOrderByWithRelationInput> = {
  "name-asc": { label: "Name (A–Z)", orderBy: { name: "asc" } },
  "name-desc": { label: "Name (Z–A)", orderBy: { name: "desc" } },
};

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role } = await auth();

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Offered",
      accessor: "delivery",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${deliveryStyles[item.delivery]}`}
        >
          {deliveryLabels[item.delivery]}
        </span>
      </td>
      <td className="hidden md:table-cell">
        {item.teachers.map((teacher) => teacher.name).join(",")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value };
            break;
          case "delivery":
            if (DELIVERY_MODES.includes(value as DeliveryMode)) {
              query.delivery = value as DeliveryMode;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      orderBy: resolveOrderBy(SORTS, queryParams.sort) ?? { name: "asc" },
      include: {
        teachers: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls
              filters={[
                {
                  key: "delivery",
                  label: "Offered",
                  options: DELIVERY_MODES.map((m) => ({ value: m, label: deliveryLabels[m] })),
                },
              ]}
              sorts={sortOptions(SORTS)}
            />
            {role === "admin" && (
              <FormContainer table="subject" type="create" />
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

export default SubjectListPage;
