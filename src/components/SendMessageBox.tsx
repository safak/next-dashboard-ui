"use client";

import { useState } from "react";

export default function SendMessageBox({
  receiverId,
}: {
  receiverId: string;
}) {
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return;
    // TODO: send message logic
    setMessage("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-3 py-2 rounded-lg border text-sm"
      />
      <button
        onClick={send}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
      >
        Send
      </button>
    </div>
  );
}
