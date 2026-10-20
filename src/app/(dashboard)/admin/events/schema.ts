import { z } from "zod";

export const eventSchema = z.object({
  id: z.coerce.number().optional(),

  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  startTime: z.coerce.date(),

  endTime: z.coerce.date(),

  classId: z.coerce.number().optional().nullable(),

  category: z.string().optional(),
});

export type EventFormInput = z.input<typeof eventSchema>;

export type EventFormValues = z.output<typeof eventSchema>;