"use server";

import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import {
  enquirySchema,
  EnquirySchema,
  websiteSettingsSchema,
  WebsiteSettingsSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { blockedFor, clientIp, recordAttempt, waitMessage } from "./rateLimit";

type State = { success: boolean; error: boolean; message?: string };
const fail = (message: string): State => ({ success: false, error: true, message });
const NOT_ALLOWED = fail("You are not allowed to do this.");

const isAdmin = async () => (await auth()).role === "admin";

export const updateWebsiteSettings = async (
  _state: State,
  data: WebsiteSettingsSchema
): Promise<State> => {
  if (!(await isAdmin())) return NOT_ALLOWED;
  const parsed = websiteSettingsSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");

  // Empty text goes back to the built-in wording
  const values = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v])
  ) as typeof parsed.data;
  await prisma.setting.upsert({
    where: { id: 1 },
    update: values,
    create: { id: 1, ...values },
  });
  revalidatePath("/", "layout");
  return { success: true, error: false };
};

// ENQUIRIES: public form, so it's rate limited and has a bot trap
const ENQUIRY_LIMIT = 5;

export const submitEnquiry = async (_state: State, data: EnquirySchema): Promise<State> => {
  const parsed = enquirySchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  const d = parsed.data;
  // A filled-in hidden field means a bot; pretend it worked
  if (d.website) return { success: true, error: false };

  const key = `enquiry:ip:${await clientIp()}`;
  const wait = blockedFor(key, ENQUIRY_LIMIT);
  if (wait) return fail(waitMessage("messages sent from this device", wait));
  recordAttempt(key, 60);

  await prisma.enquiry.create({
    data: {
      kind: d.kind,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      organisation: d.organisation || null,
      role: d.role || null,
      learners: d.learners || null,
      message: d.message,
    },
  });
  revalidatePath("/list/enquiries");
  return { success: true, error: false };
};

export const updateEnquiryStatus = async (
  _state: State,
  input: { id: number; status: "NEW" | "CONTACTED" | "CLOSED" }
): Promise<State> => {
  if (!(await isAdmin())) return NOT_ALLOWED;
  if (!["NEW", "CONTACTED", "CLOSED"].includes(input.status)) return fail("Unknown status.");
  const { count } = await prisma.enquiry.updateMany({
    where: { id: Number(input.id) },
    data: { status: input.status },
  });
  if (!count) return fail("That enquiry no longer exists.");
  revalidatePath("/list/enquiries");
  return { success: true, error: false };
};

export const deleteEnquiry = async (_state: State, formData: FormData): Promise<State> => {
  if (!(await isAdmin())) return NOT_ALLOWED;
  await prisma.enquiry.deleteMany({ where: { id: parseInt(String(formData.get("id"))) } });
  revalidatePath("/list/enquiries");
  return { success: true, error: false };
};
