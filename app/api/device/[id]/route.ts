import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const user = await currentUser();
        const { name, ipaddress } = await req.json()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.id) {
            return new NextResponse("Screen ID missing", { status: 400 });
        }
       
        const screen = await client.devices.update({
            where: {
                id: params.id,
            },
            data: {
                name,
                ipaddress,
                updatedBy: user.name,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(screen);

    } catch (error) {
        console.log("[DEVICE_PATCH]", error);
        return new NextResponse("internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        return Response.json(await client.devices.delete({
            where: { id: params.id },
        }))
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}