
import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const user = await currentUser();
        const { name, roomNumber, ward, admisDate, exceptedDate, reason, roomType, nextOfKin, isStatus } = await req.json()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.id) {
            return new NextResponse("Patient ID missing", { status: 400 });
        }

        const patient = await client.patientInfo.update({
            where: {
                id: params.id,
            },
            data: {
                name,
                admisDate,
                exceptedDate,
                reason,
                roomType,
                nextOfKin,
                ward,
                roomNumber,
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
        return Response.json(await client.patientInfo.delete({
            where: { id: params.id },
        }))
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}