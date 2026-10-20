"use client";

import { useEffect, useState } from "react";
import { formatLastActive } from "@/lib/utils/formatLastActive";

export default function LastActive({
  lastActiveAt,
}: {
  lastActiveAt?: Date | string | null;
}) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!lastActiveAt) return;

    const update = () =>
      setLabel(formatLastActive(lastActiveAt));

    update();
    const interval = setInterval(update, 60_000);

    return () => clearInterval(interval);
  }, [lastActiveAt]);

  if (!label) return null;

  const online = label === "Active now";

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span
        className={`w-2 h-2 rounded-full ${
          online ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      <span>{label}</span>
    </div>
  );
}
