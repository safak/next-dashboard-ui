import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

// import { Server, Member, Profile } from "@prisma/client"

// export type ServerWithMembersWithProfiles = Server & {
//   members: (Member & { profile: Profile })[];
// };

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};