"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddTvChannelSchema } from "@/schemas/tables.schemas";
import { z } from "zod";

export async function onCreateTVchannel(values: z.infer<typeof AddTvChannelSchema>) {
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
        },
        select: {
            id: true,
            tvName: true,
        }
    });
    return { success: "Created " + `${tvName}` + " TV successfully" };
}



export async function onUpdateTVchannel(
    req: Request,
    { params }: { params: { id: string } },
    values: z.infer<typeof AddTvChannelSchema>) {
    const validatedFields = AddTvChannelSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { tvIcon, tvName, tvNumber, tvmedia, isStatus } = validatedFields.data;
    const user = await currentUser();
    if (!user) {
        return { error: "User does not exist!" }
    }
    const tvChannel = await client.tvChannel.update({
        where: {
            id: params.id
        },
        data: {
            tvIcon,
            tvName,
            tvNumber,
            tvmedia,
            isStatus,
            createdBy: user.name,
            updatedBy: user.name,
        },
    });
    return { success: "Updated " + `${tvName}` + " TV channel successfully" };
}