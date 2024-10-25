import { client } from "@/lib/prisma";


export async function GET() {
    return Response.json(await client.hosInfo.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}