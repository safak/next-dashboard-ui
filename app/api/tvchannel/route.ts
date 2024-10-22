"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddTvChannelSchema } from "@/schemas/tables.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request, values: z.infer<typeof AddTvChannelSchema>) {
    try {
        const validatedFields = AddTvChannelSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const { tvIcon, tvName, tvNumber, tvmedia, isStatus } = validatedFields.data;
        const user = await currentUser();
        if (!user) {
            return { error: "User does not exist!" }
        }
        const tvChannel = await client.tvChannel.create({
            data: {
                tvIcon,
                tvName,
                tvNumber,
                tvmedia,
                isStatus,
                createdBy: user.name,
                updatedBy: user.name,
            }
        });
        return NextResponse.json(tvChannel);
    } catch (error) {
        console.log("[APP_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    return Response.json(await client.tvChannel.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}