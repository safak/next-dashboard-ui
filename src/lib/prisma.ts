import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Defaults to the local SQLite file; set TURSO_DATABASE_URL (libsql://...)
// and TURSO_AUTH_TOKEN to use a Turso database instead
const prismaClientSingleton = () => {
  const adapter = new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL ?? "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
