"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddContentSchema } from "@/schemas/tables.schemas";
import { z } from "zod";

export async function onContent(values: z.infer<typeof AddContentSchema>) {
    const validatedFields = AddContentSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const {
        title,
        description,
        backdrop,
        icon,
        isStatus } = validatedFields.data;
    const user = await currentUser();
    if (!user) {
        return { error: "User does not exist!" }
    }
    const app = await client.hosInfo.create({
        data: {
            title,
            description,
            backdrop,
            isStatus,
            icon,
            createdBy: user.name,
            updatedBy: user.name,
        },
        select: {
            id: true,
            title: true,
        }
    });
    return { success: "Created " + `${title}` + " app successfully" };
}


