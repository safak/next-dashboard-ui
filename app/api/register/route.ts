import { client } from "@/lib/prisma";

export async function GET() {
    return Response.json(await client.user.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}