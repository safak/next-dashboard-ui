"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SendMessageBox from "./SendMessageBox";

type Message = {
  id: number;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function ChatClient({
  me,
  otherUserId,
  messages,
}: {
  me: string;
  otherUserId: string;
  messages: Message[];
}) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex-1 flex">
      <div className="flex flex-col w-full md:max-w-3xl">
        {/* HEADER */}
        <header className="h-14 flex items-center gap-3 px-4 border-b bg-white">
          <button
            onClick={() => router.push("/list/messages")}
            className="md:hidden text-blue-600"
          >
            ←
          </button>

          <div className="w-9 h-9 bg-gray-200 rounded-full" />
          <div>
            <p className="text-sm font-semibold">User</p>
            <p className="text-[11px] text-gray-400">Online</p>
          </div>
        </header>

        {/* CHAT AREA */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-[6px]"
          style={{
            backgroundColor: "#E5DDD5",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.senderId === me ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 max-w-[72%] text-sm leading-snug
                  ${
                    m.senderId === me
                      ? "bg-[#DCF8C6] rounded-2xl rounded-br-sm shadow"
                      : "bg-white rounded-2xl rounded-bl-sm shadow-sm"
                  }`}
              >
                <div>{m.content}</div>

                <div className="mt-1 text-[10px] text-gray-500 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <footer className="bg-[#F0F2F5] px-3 py-2">
          <SendMessageBox receiverId={otherUserId} />
        </footer>
      </div>
    </section>
  );
}
