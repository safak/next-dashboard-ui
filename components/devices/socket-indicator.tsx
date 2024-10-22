"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Hint } from "@/components/tootips";

export const SocketIndicator = () => {
   const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-x-2 relative">
        <Hint
          side="top"
          align="center"
          label="Offline"
        >
          <span
            className="absolute block rounded-full bg-red-500 right-2 ring-red-500 h-1 w-1 md:h-1.5 md:w-1.5 top-1"
          >
          </span>
        </Hint>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-x-2 relative">
      <Hint
        side="top"
        align="center"
        label="Online"
      >
        <span
          className="absolute block rounded-full bg-green-500 right-2 ring-white-1 h-1 w-1 md:h-1.5 md:w-1.5 top-1"
        >
        </span>
      </Hint>
    </div>

  );
};
