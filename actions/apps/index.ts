"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddAppSchema, UpdateAppSchema } from "@/schemas/app.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function onCreateApp(values: z.infer<typeof AddAppSchema>) {
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
        },
        select: {
            id: true,
            name: true,
        }
    });
    return { success: "Created " + `${name}` + " app successfully" };
}

export async function onDelete(
    { params }: { params: { appId: string } }) {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await client.apps.delete({
            where: {
                id: params.appId,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[APP_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    return Response.json(await client.apps.findUnique({
        where: { id: params.id },
    }))
}

export async function onUpdate(
    req: Request,
    { params }: { params: { id: string } },
    values: z.infer<typeof UpdateAppSchema>) {
    const validatedFields = UpdateAppSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, description, packagename, classname, isStatus, image } = validatedFields.data;
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }
    await client.apps.update({
        where: { id: params.id },
        data: {
            name,
            description,
            packagename,
            classname,
            image,
            isStatus,
            updatedBy: user.name,
            updatedAt: new Date()
        }
    });
    return { success: "Update " + `${name}` + " app successfully" };
}


export async function getAllApps() {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }
    return Response.json(await client.apps.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}


