import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import LeadTable from "@/components/LeadTable";

const LeadsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const { page, search, status, class: classFilter } = params;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const p = page ? Number(page) : 1;

  /* ================= FILTER ================= */

  const where: Prisma.LeadWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) where.status = status as any;
  if (classFilter) where.classInterested = classFilter;

  /* ================= FETCH ================= */

  const [rows, count] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lead.count({ where }),
  ]);

  /* ================= ACTIVE FILTER ================= */

  const active = (key: string, value?: string) => {
    if (!value) return !status && !classFilter;
    return status === value || classFilter === value;
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 p-4 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-lg font-semibold">Admissions Leads</h1>
        <TableSearch />
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap">
        <a
          href="/leads"
          className={`text-xs px-3 py-1 rounded-full ${
            active("all")
              ? "bg-purple-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All
        </a>

        <a
          href="/leads?status=NEW"
          className={`text-xs px-3 py-1 rounded-full ${
            active("status", "NEW")
              ? "bg-yellow-500 text-white"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          New
        </a>

        <a
          href="/leads?status=CONTACTED"
          className={`text-xs px-3 py-1 rounded-full ${
            active("status", "CONTACTED")
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          Contacted
        </a>

        <a
          href="/leads?status=CONVERTED"
          className={`text-xs px-3 py-1 rounded-full ${
            active("status", "CONVERTED")
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-700"
          }`}
        >
          Converted
        </a>

        <a
          href="/leads?class=Nursery"
          className={`text-xs px-3 py-1 rounded-full ${
            active("class", "Nursery")
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          Nursery
        </a>

        <a
          href="/leads?class=LKG"
          className={`text-xs px-3 py-1 rounded-full ${
            active("class", "LKG")
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          LKG
        </a>

        <a
          href="/leads?class=UKG"
          className={`text-xs px-3 py-1 rounded-full ${
            active("class", "UKG")
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          UKG
        </a>
      </div>

      {/* TABLE */}
      <LeadTable data={rows} role={role} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default LeadsPage;