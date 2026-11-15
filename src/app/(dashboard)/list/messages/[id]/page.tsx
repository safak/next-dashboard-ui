import FormContainer from "@/components/FormContainer";
import { deleteMessageAndReturn } from "@/lib/actions";
import { getAllUsers } from "@/lib/contacts";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

const MessagePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { userId } = await auth();

  const message = await prisma.message.findFirst({
    where: {
      id: parseInt(id) || -1,
      OR: [{ senderId: userId! }, { receiverId: userId! }],
    },
  });
  if (!message) notFound();

  const isReceiver = message.receiverId === userId;
  if (isReceiver && !message.read) {
    await prisma.message.update({
      where: { id: message.id },
      data: { read: true },
    });
  }

  const users = await getAllUsers();
  const nameOf = (uid: string) =>
    users.find((u) => u.id === uid)?.name ?? "Unknown user";

  const replySubject = message.subject.startsWith("Re: ")
    ? message.subject
    : `Re: ${message.subject}`;

  return (
    <div className="card p-6 flex-1 m-4 mt-0 flex flex-col gap-6">
      <Link
        href={isReceiver ? "/list/messages" : "/list/messages?box=sent"}
        className="text-sm text-gray-500 hover:text-gray-800 self-start"
      >
        ← Back to {isReceiver ? "inbox" : "sent"}
      </Link>

      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold">{message.subject}</h1>
          <p className="text-sm text-gray-500 mt-1">
            From <span className="text-gray-800">{nameOf(message.senderId)}</span>{" "}
            to <span className="text-gray-800">{nameOf(message.receiverId)}</span>
            {" · "}
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(message.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isReceiver && (
            <FormContainer
              table="message"
              type="create"
              data={{ receiverId: message.senderId, subject: replySubject }}
            />
          )}
          <form action={deleteMessageAndReturn}>
            <input type="hidden" name="id" value={message.id} />
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
        {message.body}
      </p>
    </div>
  );
};

export default MessagePage;
