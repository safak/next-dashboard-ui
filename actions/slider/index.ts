"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddSliderSchema } from "@/schemas/tables.schemas";
import { z } from "zod";

export async function onSlider(values: z.infer<typeof AddSliderSchema>) {
    const validatedFields = AddSliderSchema.safeParse(values);

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
    return { success: "Created " + `${name}` + " slider successfully" };
    
}


