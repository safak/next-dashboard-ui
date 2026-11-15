import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getAllUsers } from "@/lib/contacts";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Message, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import Link from "next/link";

const MessagesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId } = await auth();
  const { page, box, search } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const sent = box === "sent";

  const query: Prisma.MessageWhereInput = sent
    ? { senderId: userId! }
    : { receiverId: userId! };
  if (search) {
    query.OR = [
      { subject: { contains: search } },
      { body: { contains: search } },
    ];
  }

  const [data, count, unread, users] = await Promise.all([
    prisma.message.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.message.count({ where: query }),
    prisma.message.count({ where: { receiverId: userId!, read: false } }),
    getAllUsers(),
  ]);

  const nameOf = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Unknown user";

  const columns = [
    { header: sent ? "To" : "From", accessor: "person" },
    { header: "Subject", accessor: "subject" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: Message) => {
    const isUnread = !sent && !item.read;
    return (
      <tr
        key={item.id}
        className={`border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight ${
          isUnread ? "font-semibold" : ""
        }`}
      >
        <td className="p-4">
          <div className="flex items-center gap-2">
            {isUnread && (
              <span
                className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"
                title="Unread"
              />
            )}
            {nameOf(sent ? item.receiverId : item.senderId)}
          </div>
        </td>
        <td>
          <Link
            href={`/list/messages/${item.id}`}
            className="block py-2 hover:underline"
          >
            {item.subject}
            <span className="block text-xs font-normal text-gray-400 truncate max-w-[40ch]">
              {item.body}
            </span>
          </Link>
        </td>
        <td className="hidden md:table-cell text-gray-500 font-normal">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(item.createdAt)}
        </td>
        <td>
          <FormContainer table="message" type="delete" id={item.id} />
        </td>
      </tr>
    );
  };

  const tab = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm transition ${
      active
        ? "bg-lamaSkyLight font-medium text-gray-900"
        : "text-gray-500 hover:bg-gray-50"
    }`;

  return (
    <div className="card p-4 flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <h1 className="hidden md:block text-lg font-semibold mr-2">Messages</h1>
          <Link href="/list/messages" className={tab(!sent)}>
            Inbox
            {unread > 0 && (
              <span className="ml-2 rounded-full bg-indigo-500 px-1.5 text-[10px] text-white">
                {unread}
              </span>
            )}
          </Link>
          <Link href="/list/messages?box=sent" className={tab(sent)}>
            Sent
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="message" type="create" />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default MessagesPage;
