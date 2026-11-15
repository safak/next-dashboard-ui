import EnquiryActions from "@/components/EnquiryActions";
import ListControls from "@/components/ListControls";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { EnquiryKind, EnquiryStatus, Prisma } from "@prisma/client";

const kindLabels: Record<EnquiryKind, string> = {
  SCHOOL_DEMO: "School demo request",
  GENERAL: "Contact form",
};
const statusStyles: Record<EnquiryStatus, string> = {
  NEW: "bg-amber-100 text-amber-800",
  CONTACTED: "bg-sky-100 text-sky-800",
  CLOSED: "bg-gray-100 text-gray-600",
};

const EnquiriesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { page, kind, status, search } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const where: Prisma.EnquiryWhereInput = {};
  if (kind === "SCHOOL_DEMO" || kind === "GENERAL") where.kind = kind;
  // Closed ones are hidden unless asked for
  where.status = status === "NEW" || status === "CONTACTED" || status === "CLOSED" ? status : { not: "CLOSED" };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { organisation: { contains: search } },
      { message: { contains: search } },
    ];
  }

  const [data, count] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.enquiry.count({ where }),
  ]);

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-semibold">Enquiries</h1>
          <p className="text-xs text-gray-500">
            Demo requests from schools and messages from the website&apos;s contact form.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <ListControls
            filters={[
              { key: "kind", label: "Type", options: [
                { value: "SCHOOL_DEMO", label: "School demo requests" },
                { value: "GENERAL", label: "Contact form" },
              ] },
              { key: "status", label: "Status", options: [
                { value: "NEW", label: "New" },
                { value: "CONTACTED", label: "Contacted" },
                { value: "CLOSED", label: "Closed" },
              ] },
            ]}
          />
        </div>
      </div>

      {data.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No enquiries to show.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {data.map((e) => (
            <li key={e.id} className="rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{e.name}</span>
                  {e.organisation && <span className="text-sm text-gray-600">· {e.organisation}</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[e.status]}`}>
                    {e.status.charAt(0) + e.status.slice(1).toLowerCase()}
                  </span>
                  <span className="rounded-full bg-lamaPurpleLight px-2 py-0.5 text-[11px]">{kindLabels[e.kind]}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(e.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                <a href={`mailto:${e.email}`} className="text-indigo-600 hover:underline">{e.email}</a>
                {e.phone && <> · <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="hover:underline">{e.phone}</a></>}
                {e.role && ` · ${e.role}`}
                {e.learners && ` · about ${e.learners} learners`}
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-line">{e.message}</p>
              <EnquiryActions id={e.id} status={e.status} />
            </li>
          ))}
        </ul>
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EnquiriesPage;
