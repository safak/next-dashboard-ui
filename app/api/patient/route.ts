import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddPatientSchema } from "@/schemas/tables.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(values: z.infer<typeof AddPatientSchema>) {
    try {
        const validatedFields = AddPatientSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }
        const { name,
            exceptedDate,
            admisDate,
            reason,
            roomType,
            nextOfKin,
            ward,
            roomNumber,
            isStatus } = validatedFields.data;
        const user = await currentUser();
        if (!user) {
            return { error: "User does not exist!" }
        }
        const app = await client.patientInfo.create({
            data: {
                name,
                exceptedDate,
                admisDate,
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
        return NextResponse.json(app);
    } catch (error) {
        console.log("[Patient_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    return Response.json(await client.patientInfo.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    }))
}