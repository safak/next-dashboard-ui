import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddAppSchema } from "@/schemas/app.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(values: z.infer<typeof AddAppSchema>) {
    try {
        const validatedFields = AddAppSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const { name, description, packagename, classname, isStatus, image } = validatedFields.data;
        const user = await currentUser();
        if (!user) {
            return { error: "User does not exist!" }
        }
        const app = await client.apps.create({
            data: {
                name,
                description,
                packagename,
                classname,
                image,
                isStatus,
                createdBy: user.name,
                updatedBy: user.name,
            }
        });
        return NextResponse.json(app);
    } catch (error) {
        console.log("[APP_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function GET() {
    return Response.json(await client.apps.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}
