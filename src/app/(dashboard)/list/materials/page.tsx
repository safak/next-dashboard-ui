import Image from "next/image";
import ListControls from "@/components/ListControls";
import MaterialDelete from "@/components/MaterialDelete";
import MaterialUpload from "@/components/MaterialUpload";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { auth } from "@/lib/auth";
import { resolveOrderBy, SortMap, sortOptions, toOptions } from "@/lib/listQuery";
import { canDeleteMaterial, materialAccessWhere } from "@/lib/materials";
import {
  formatFileSize,
  isImageType,
  MATERIAL_TYPES,
  materialTypeLabels,
  materialTypeStyles,
} from "@/lib/materialTypes";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { MaterialType, Prisma } from "@prisma/client";

const SORTS: SortMap<Prisma.MaterialOrderByWithRelationInput> = {
  newest: { label: "Newest first", orderBy: { createdAt: "desc" } },
  title: { label: "Title (A–Z)", orderBy: { title: "asc" } },
  year: { label: "Year (latest)", orderBy: { year: "desc" } },
};

const MaterialListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, role } = await auth();
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const access = await materialAccessWhere(role, userId);
  const isLearner = role === "student" || role === "parent";

  const query: Prisma.MaterialWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    switch (key) {
      case "subjectId":
        query.subjectId = parseInt(value);
        break;
      case "gradeId":
        query.OR = [{ gradeId: parseInt(value) }, { gradeId: null }];
        break;
      case "type":
        if (MATERIAL_TYPES.includes(value as MaterialType)) query.type = value as MaterialType;
        break;
      case "year":
        query.year = parseInt(value);
        break;
      case "search":
        query.AND = [
          { OR: [{ title: { contains: value } }, { description: { contains: value } }] },
        ];
        break;
    }
  }
  const where: Prisma.MaterialWhereInput = { AND: [access ?? { id: -1 }, query] };

  const [data, count, filterSubjects, grades, years, uploadSubjects] = await Promise.all([
    prisma.material.findMany({
      where,
      include: {
        subject: { select: { name: true } },
        grade: { select: { level: true } },
      },
      orderBy: resolveOrderBy(SORTS, queryParams.sort) ?? { createdAt: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.material.count({ where }),
    // Learners only get filters for subjects they can actually see
    prisma.subject.findMany({
      where: isLearner ? { materials: { some: access ?? { id: -1 } } } : {},
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.grade.findMany({ orderBy: { level: "asc" } }),
    prisma.material.findMany({
      where: { AND: [access ?? { id: -1 }, { year: { not: null } }] },
      distinct: ["year"],
      select: { year: true },
      orderBy: { year: "desc" },
    }),
    role === "admin" || role === "teacher"
      ? prisma.subject.findMany({
          where: role === "teacher" ? { teachers: { some: { id: userId! } } } : {},
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [],
  ]);

  type Row = (typeof data)[number];

  const columns = [
    { header: "Material", accessor: "title" },
    { header: "Type", accessor: "type", className: "hidden md:table-cell" },
    { header: "Subject", accessor: "subject" },
    { header: "Grade", accessor: "grade", className: "hidden lg:table-cell" },
    { header: "Year", accessor: "year", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: Row) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">
        <div className="flex items-start gap-3">
          {isImageType(item.mimeType) && (
            <a href={`/api/materials/${item.id}?view=1`} target="_blank" rel="noopener" title="Open full size" className="shrink-0">
              <Image
                src={`/api/materials/${item.id}?view=1`}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-lg object-cover border border-gray-200"
              />
            </a>
          )}
          <div>
            <div className="font-semibold">{item.title}</div>
            {item.description && (
              <p className="text-xs text-gray-500 max-w-[45ch] truncate">{item.description}</p>
            )}
            <p className="text-xs text-gray-400">
              {item.fileName} · {formatFileSize(item.size)}
            </p>
            <span className={`md:hidden mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${materialTypeStyles[item.type]}`}>
              {materialTypeLabels[item.type]}
            </span>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${materialTypeStyles[item.type]}`}>
          {materialTypeLabels[item.type]}
        </span>
      </td>
      <td>{item.subject.name}</td>
      <td className="hidden lg:table-cell">
        {item.grade ? `Grade ${item.grade.level}` : "All grades"}
      </td>
      <td className="hidden lg:table-cell">{item.year ?? "—"}</td>
      <td>
        <div className="flex items-center gap-2">
          <a
            href={`/api/materials/${item.id}`}
            download
            className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-indigo-600"
          >
            Download
          </a>
          {canDeleteMaterial(role, userId, item) && <MaterialDelete id={item.id} title={item.title} />}
        </div>
      </td>
    </tr>
  );

  const filters = [
    { key: "subjectId", label: "Subject", options: toOptions(filterSubjects, (s) => s.name) },
    { key: "type", label: "Type", options: MATERIAL_TYPES.map((t) => ({ value: t, label: materialTypeLabels[t] })) },
    { key: "gradeId", label: "Grade", options: grades.map((g) => ({ value: g.id, label: `Grade ${g.level}` })) },
    { key: "year", label: "Year", options: years.map((y) => ({ value: y.year!, label: String(y.year) })) },
  ];

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-semibold">Study Materials &amp; Question Papers</h1>
          <p className="text-xs text-gray-500">
            {role === "student"
              ? "Materials for the subjects you registered for, in your grade."
              : role === "parent"
              ? "Materials for your children's subjects and grades."
              : "Upload notes, question papers, memorandums and pictures for learners."}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ListControls filters={filters} sorts={sortOptions(SORTS)} />
            {(role === "admin" || role === "teacher") && (
              <MaterialUpload
                subjects={uploadSubjects}
                grades={grades.map((g) => ({ id: g.id, name: `Grade ${g.level}` }))}
              />
            )}
          </div>
        </div>
      </div>
      {!access && role === "parent" && (
        <p className="mt-4 text-sm text-gray-500">
          Link your child on your dashboard to see their study materials.
        </p>
      )}
      {access && count === 0 && (
        <p className="mt-4 text-sm text-gray-500">No materials yet.</p>
      )}
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default MaterialListPage;
