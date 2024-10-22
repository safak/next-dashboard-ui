import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddSliderSchema } from "@/schemas/tables.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(values: z.infer<typeof AddSliderSchema>) {
    const validatedFields = AddSliderSchema.safeParse(values);
try{
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const {
        name,
        image,
        actionType,
        isStatus } = validatedFields.data;
    const user = await currentUser();
    if (!user) {
        return { error: "User does not exist!" }
    }
    const bannerSlide = await client.bannerSlide.create({
        data: {
            name,
            image,
            actionType,
            isStatus,
            createdBy: user.name,
            updatedBy: user.name,
        },
        select: {
            id: true,
            name: true,
        }
    });
    return NextResponse.json(bannerSlide);
} catch (error) {
    console.log("[SERVERS_POST", error);
    return new NextResponse("Internal Error", { status: 500 })
}
}

export async function GET() {
    return Response.json(await client.bannerSlide.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}