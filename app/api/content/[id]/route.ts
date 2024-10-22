
import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const user = await currentUser();
        const {
            title,
            description,
            backdrop,
            icon,
            isStatus
        } = await req.json()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.id) {
            return new NextResponse("Content ID missing", { status: 400 });
        }

        const patient = await client.hosInfo.update({
            where: {
                id: params.id,
            },
            data: {
                title,
                description,
                backdrop,
                icon,
                isStatus,
                createdBy: user.name,
                updatedBy: user.name,
            }
        });
        return NextResponse.json(patient);

    } catch (error) {
        console.log("[TVCHANNEL_PATCH]", error);
        return new NextResponse("internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        return Response.json(await client.hosInfo.delete({
            where: { id: params.id },
        }))
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}