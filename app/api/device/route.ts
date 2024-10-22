import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddScreenSchema } from "@/schemas/tables.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(values: z.infer<typeof AddScreenSchema>) {
    const validatedFields = AddScreenSchema.safeParse(values);
    try {
        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }
        const {
            name,
            ipaddress
        } = validatedFields.data;
        const user = await currentUser();
        if (!user) {
            return { error: "User does not exist!" }
        }
        const screen = await client.devices.create({
            data: {
                name,
                ipaddress,
                createdBy: user.name,
                updatedBy: user.name,
            },
            select: {
                id: true,
                name: true,
            }
        });
        return NextResponse.json(screen);
    } catch (error) {
        console.log("[SCREEN_POST", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET() {
    return Response.json(await client.devices.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}