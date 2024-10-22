import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "@/schemas/setting.schemas";

export const AddAppSchema =
    z.object({
        user: z.any(),

        image: z
            .any(),
        //     .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
        //         message: 'Your file size must be less then 2MB',
        //     })
        //     .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
        //         message: 'Only JPG, JPEG & PNG are accepted file formats',
        //     }),
        name: z
            .string()
            .min(3, { message: 'The name must have atleast 3 characters' }),
        description: z
            .string()
            .min(1, { message: 'Display cannot be left empty' }),
        packagename: z
            .string()
            .min(1, { message: 'Display cannot be left empty' }),
        classname: z.string(),
        isStatus: z.optional(z.boolean()),
    })


export const UpdateAppSchema =
    z.object({
        user: z.any(),

        image: z
            .any(),
        //     .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
        //         message: 'Your file size must be less then 2MB',
        //     })
        //     .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
        //         message: 'Only JPG, JPEG & PNG are accepted file formats',
        //     }),
        name: z
            .string()
            .min(3, { message: 'The name must have atleast 3 characters' }),
        description: z
            .string()
            .min(1, { message: 'Display cannot be left empty' }),
        packagename: z
            .string()
            .min(1, { message: 'Display cannot be left empty' }),
        classname: z.string(),
        isStatus: z.optional(z.boolean()),
    })

export const DeleteAppSchema =
    z.object({
        id: z.any(),
    })