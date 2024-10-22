"use server";

import { currentUser } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { AddPatientSchema } from "@/schemas/tables.schemas";
import { z } from "zod";

export async function onCreatePatient(values: z.infer<typeof AddPatientSchema>) {
        const validatedFields = AddPatientSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const { 
            name, 
            admisDate,
            exceptedDate,
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
        const patient = await client.patientInfo.create({
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
        return { success: "Created " + `${name}` + " Patient successfully" };
}