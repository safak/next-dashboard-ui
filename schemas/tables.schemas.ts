import { optional, z } from "zod";



export const AddTvChannelSchema = z.object({
  tvName: z
    .string()
    .min(3, { message: 'The name must have atleast 3 characters' }),
  tvIcon: z
    .any(),
  // .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
  //   message: 'Your file size must be less then 2MB',
  // })
  // .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
  //   message: 'Only JPG, JPEG & PNG are accepted file formats',
  // }),
  tvmedia: z
    .string()
    .min(1, { message: 'URLs cannot be left empty' }),
  tvNumber: z.optional(z.string()),
  isStatus: z.optional(z.boolean()),
})

export type TvChannel = z.infer<typeof AddTvChannelSchema>;

//Schema for patient
export const AddPatientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'The name must have atleast 3 characters' }),
  roomNumber: z
    .string()
    .min(1, { message: 'Room number cannot be left empty' }),
  ward: z
    .string()
    .min(1, { message: 'Room number cannot be left empty' }),
  exceptedDate: z
    .optional(z.date()),
  admisDate: z
    .date(),
  reason: z.optional(z.string()),
  roomType: z.optional(z.string()),
  nextOfKin: z.optional(z.string()),
  isStatus: z.optional(z.boolean()),
})


export type Patient = z.infer<typeof AddPatientSchema>;


export const AddContentSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'The name must have atleast 3 characters' }),
  description: z
    .string()
    .min(1, { message: 'Room number cannot be left empty' }),
  icon: z
    .any(),
  backdrop: z
    .any(),
  isStatus: z.optional(z.boolean()),
})

export const AddSliderSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'The name must have atleast 3 characters' }),
  image: z
    .any(),
  //   .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
  //     message: 'Your file size must be less then 2MB',
  // })
  // .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
  //     message: 'Only JPG, JPEG & PNG are accepted file formats',
  // }),
  onshow: z.string(),
  actionType: z.string(),
  isStatus: z.optional(z.boolean()),
})

//Schema for Screen
export const AddScreenSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'The name must have atleast 3 characters' }),
  ipaddress: z
    .string()
    .min(1, { message: 'Room number cannot be left empty' }),
})
