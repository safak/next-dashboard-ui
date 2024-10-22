import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    return Response.json(await client.tvChannel.findUnique({
        where: { id: params.id },
    }))
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const user = await currentUser();
        const { tvIcon, tvName, tvNumber, tvmedia, isStatus } = await req.json()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.id) {
            return new NextResponse("TV Channel missing", { status: 400 });
        }

        const apps = await client.tvChannel.update({
            where: {
                id: params.id,
            },
            data: {
                tvIcon,
                tvName,
                tvNumber,
                tvmedia,
                isStatus,
                updatedAt: new Date(),
                updatedBy: user.name,
            }
        });

        return NextResponse.json(apps);

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
        return Response.json(await client.tvChannel.delete({
            where: { id: params.id },
        }))
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}