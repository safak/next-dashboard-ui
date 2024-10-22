"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddScreenSchema } from "@/schemas/tables.schemas";
import { z } from "zod";

export async function onCreateScreen(values: z.infer<typeof AddScreenSchema>) {
    const validatedFields = AddScreenSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const {
        name,
        ipaddress } = validatedFields.data;
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
    return { success: "Created " + `${name}` + " slider successfully" };
    
}


