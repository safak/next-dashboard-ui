import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    return Response.json(await client.apps.findUnique({
        where: { id: params.id },
    }))
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const user = await currentUser();
        const { name, description, packagename, classname, isStatus, image } = await req.json()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.id) {
            return new NextResponse("App ID missing", { status: 400 });
        }
       
        const apps = await client.apps.update({
            where: {
                id: params.id,
            },
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

        return NextResponse.json(apps);

    } catch (error) {
        console.log("[APP_PATCH]", error);
        return new NextResponse("internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        return Response.json(await client.apps.delete({
            where: { id: params.id },
        }))
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}