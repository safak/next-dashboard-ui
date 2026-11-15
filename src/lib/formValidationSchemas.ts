import { z } from "zod";
import { parseRandToCents } from "./money";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
  delivery: z.enum(["PHYSICAL", "ONLINE", "BOTH"], {
    message: "Choose how the subject is offered!",
  }),
});

export type SubjectSchema = z.input<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.input<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.input<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  // Left empty until a parent registers with the student number
  parentId: z.string().optional(),
});

export type StudentSchema = z.input<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.input<typeof examSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
});

export type ParentSchema = z.input<typeof parentSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Lesson name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day is required!",
  }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  subjectId: z.coerce.number({ message: "Subject is required!" }),
  classId: z.coerce.number({ message: "Class is required!" }),
  teacherId: z.string().min(1, { message: "Teacher is required!" }),
});

export type LessonSchema = z.input<typeof lessonSchema>;

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  startDate: z.coerce.date({ message: "Start date is required!" }),
  dueDate: z.coerce.date({ message: "Due date is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.input<typeof assignmentSchema>;

export const resultSchema = z
  .object({
    id: z.coerce.number().optional(),
    score: z.coerce
      .number({ message: "Score is required!" })
      .int()
      .min(0, { message: "Score can't be negative!" })
      .max(100, { message: "Score can't exceed 100!" }),
    studentId: z.string().min(1, { message: "Student is required!" }),
    // "exam-<id>" or "assignment-<id>"
    assessment: z.string().regex(/^(exam|assignment)-\d+$/, {
      message: "Exam or assignment is required!",
    }),
  });

export type ResultSchema = z.input<typeof resultSchema>;

export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.coerce.date({ message: "Date is required!" }),
  present: z.enum(["true", "false"], { message: "Status is required!" }),
  studentId: z.string().min(1, { message: "Student is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AttendanceSchema = z.input<typeof attendanceSchema>;

export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  classId: z.string().optional(), // "" means the whole school
});

export type EventSchema = z.input<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
  classId: z.string().optional(), // "" means the whole school
});

export type AnnouncementSchema = z.input<typeof announcementSchema>;

export const settingsSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(1, { message: "School name is required!" })
    .max(60, { message: "School name must be at most 60 characters!" }),
  academicYear: z
    .string()
    .trim()
    .regex(/^\d{4}\/\d{2}$/, { message: "Use the format 2025/26" }),
});

export type SettingsSchema = z.input<typeof settingsSchema>;

export const messageSchema = z.object({
  receiverId: z.string().min(1, { message: "Recipient is required!" }),
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required!" })
    .max(120, { message: "Subject must be at most 120 characters!" }),
  body: z
    .string()
    .trim()
    .min(1, { message: "Message is required!" })
    .max(5000, { message: "Message must be at most 5000 characters!" }),
});

export type MessageSchema = z.input<typeof messageSchema>;

const clockTime = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Use the format HH:MM" });

export const extraClassSchema = z
  .object({
    id: z.coerce.number().optional(),
    name: z.string().trim().min(1, { message: "Name is required!" }),
    description: z
      .string()
      .trim()
      .max(500, { message: "Description must be at most 500 characters!" })
      .optional(),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
      message: "Day is required!",
    }),
    startTime: clockTime,
    endTime: clockTime,
    capacity: z.coerce
      .number({ message: "Capacity is required!" })
      .int()
      .min(1, { message: "Capacity must be at least 1!" })
      .max(500, { message: "Capacity can't exceed 500!" }),
    subjectId: z.coerce.number({ message: "Subject is required!" }),
    teacherId: z.string().min(1, { message: "Teacher is required!" }),
  })
  // "HH:MM" strings compare correctly as text
  .refine((d) => d.endTime > d.startTime, {
    message: "End time must be after start time!",
    path: ["endTime"],
  });

export type ExtraClassSchema = z.input<typeof extraClassSchema>;

// SELF-REGISTRATION

// Subjects a learner takes, each with how they want it taught
const subjectChoicesSchema = z
  .array(
    z.object({
      subjectId: z.coerce.number(),
      format: z.enum(["ONE_ON_ONE", "GROUP", "HOUSE_CALL", "ONLINE"], {
        message: "Choose a lesson type for each subject!",
      }),
    })
  )
  .min(1, { message: "Choose at least one subject!" });

export const studentSubjectsSchema = z.object({
  studentId: z.string().min(1),
  subjects: subjectChoicesSchema,
});

export type StudentSubjectsSchema = z.input<typeof studentSubjectsSchema>;

const optionalText = z.string().trim().optional().or(z.literal(""));

const accountFields = {
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: "Use only letters, numbers, dots, dashes and underscores.",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  confirmPassword: z.string(),
};

const passwordsMatch = {
  check: (d: { password: string; confirmPassword: string }) =>
    d.password === d.confirmPassword,
  issue: { message: "Passwords don't match!", path: ["confirmPassword"] },
};

const studentNumberField = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, { message: "Student number is required!" });

const childBirthdayField = z.coerce.date({
  message: "Your child's date of birth is required!",
});

export const studentRegistrationSchema = z
  .object({
    ...accountFields,
    name: z.string().trim().min(1, { message: "First name is required!" }),
    surname: z.string().trim().min(1, { message: "Last name is required!" }),
    birthday: z.coerce
      .date({ message: "Date of birth is required!" })
      .max(new Date(), { message: "Date of birth must be in the past!" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    bloodType: z.string().trim().min(1, { message: "Blood type is required!" }),
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),
    phone: optionalText,
    address: z.string().trim().min(1, { message: "Address is required!" }),

    gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
    previousSchool: optionalText,
    lastGradeCompleted: optionalText,
    medicalNotes: z.string().trim().max(1000).optional().or(z.literal("")),
    subjects: subjectChoicesSchema,

    guardianName: z
      .string()
      .trim()
      .min(1, { message: "Guardian's full name is required!" }),
    guardianRelationship: z
      .string()
      .trim()
      .min(1, { message: "Relationship is required!" }),
    guardianPhone: z
      .string()
      .trim()
      .min(1, { message: "Guardian's phone is required!" }),
    guardianEmail: z
      .string()
      .trim()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),

    acceptContract: z.literal(true, {
      message: "You must accept the enrolment agreement!",
    }),
    contractSignature: z
      .string()
      .trim()
      .min(1, { message: "Type your full name to sign!" }),
  })
  .refine(passwordsMatch.check, passwordsMatch.issue)
  .refine(
    (d) =>
      d.contractSignature.toLowerCase().replace(/\s+/g, " ") ===
      `${d.name} ${d.surname}`.toLowerCase().replace(/\s+/g, " "),
    {
      message: "Your signature must match your first and last name exactly.",
      path: ["contractSignature"],
    }
  );

export type StudentRegistrationSchema = z.input<
  typeof studentRegistrationSchema
>;

export const parentRegistrationSchema = z
  .object({
    ...accountFields,
    name: z.string().trim().min(1, { message: "First name is required!" }),
    surname: z.string().trim().min(1, { message: "Last name is required!" }),
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),
    phone: z.string().trim().min(1, { message: "Phone is required!" }),
    address: z.string().trim().min(1, { message: "Address is required!" }),
    studentNumber: studentNumberField,
    childBirthday: childBirthdayField,
  })
  .refine(passwordsMatch.check, passwordsMatch.issue);

export type ParentRegistrationSchema = z.input<
  typeof parentRegistrationSchema
>;

export const linkChildSchema = z.object({
  studentNumber: studentNumberField,
  childBirthday: childBirthdayField,
});

export type LinkChildSchema = z.input<typeof linkChildSchema>;

export const approveRegistrationSchema = z.object({
  id: z.string().min(1),
  classId: z.coerce.number().min(1, { message: "Choose a class!" }),
});

export type ApproveRegistrationSchema = z.input<
  typeof approveRegistrationSchema
>;

// Text fields of a study material upload (the file is checked separately)
export const materialSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required!" }).max(150),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  type: z.enum(["STUDY_MATERIAL", "QUESTION_PAPER", "MEMORANDUM"], {
    message: "Choose what kind of material this is!",
  }),
  subjectId: z.coerce.number().int().min(1, { message: "Subject is required!" }),
  // "" means every grade
  gradeId: z.union([z.literal(""), z.coerce.number().int().min(1)]).optional(),
  year: z
    .union([
      z.literal(""),
      z.coerce.number().int().min(1990).max(2100, { message: "Enter a valid year!" }),
    ])
    .optional(),
});

export type MaterialSchema = z.input<typeof materialSchema>;

// FEES (amounts arrive as text like "450" or "450.50" and become cents)

const randAmount = z
  .string()
  .trim()
  .refine((v) => parseRandToCents(v) !== null, {
    message: "Enter an amount like 450 or 1 250.50",
  });

export const paymentSchema = z.object({
  studentId: z.string().min(1),
  amount: randAmount,
  paidOn: z.coerce
    .date({ message: "Payment date is required!" })
    .max(new Date(Date.now() + 24 * 60 * 60 * 1000), { message: "The payment date can't be in the future!" }),
  method: z.enum(["EFT", "CASH", "CARD", "OTHER"], { message: "Choose how they paid!" }),
  reference: z.string().trim().max(100).optional().or(z.literal("")),
});

export type PaymentSchema = z.input<typeof paymentSchema>;

export const feeSettingsSchema = z.object({
  registrationFee: randAmount.or(z.literal("")),
  siblingDiscountPercent: z.coerce
    .number()
    .int()
    .min(0, { message: "Use 0–100" })
    .max(100, { message: "Use 0–100" }),
  paymentDueDay: z.coerce
    .number()
    .int()
    .min(1, { message: "Use a day from 1 to 28" })
    .max(28, { message: "Use a day from 1 to 28" }),
  bankDetails: z.string().trim().max(500).optional().or(z.literal("")),
});

export type FeeSettingsSchema = z.input<typeof feeSettingsSchema>;

export const feeRatesSchema = z.object({
  rates: z.array(
    z.object({
      subjectId: z.number().int().nullable(),
      format: z.enum(["ONE_ON_ONE", "GROUP", "HOUSE_CALL", "ONLINE"]),
      // "" removes the rate
      amount: randAmount.or(z.literal("")),
    })
  ),
});

export type FeeRatesSchema = z.input<typeof feeRatesSchema>;

// PUBLIC WEBSITE

const optionalLine = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const websiteSettingsSchema = z.object({
  tagline: optionalLine(200),
  aboutText: optionalLine(2000),
  missionText: optionalLine(500),
  contactPhone: optionalLine(40),
  contactEmail: z.string().trim().email({ message: "Invalid email address!" }).optional().or(z.literal("")),
  address: optionalLine(300),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, { message: "Digits only, with the country code (e.g. 27821234567)" })
    .optional()
    .or(z.literal("")),
  officeHours: optionalLine(200),
  showFeesPublicly: z.boolean(),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: "Pick a colour" }),
});

export type WebsiteSettingsSchema = z.input<typeof websiteSettingsSchema>;

export const enquirySchema = z.object({
  kind: z.enum(["SCHOOL_DEMO", "GENERAL"]),
  name: z.string().trim().min(1, { message: "Your name is required!" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address!" }),
  phone: optionalLine(40),
  organisation: optionalLine(150),
  role: optionalLine(100),
  learners: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(100000)])
    .optional(),
  message: z.string().trim().min(5, { message: "Tell us a little more" }).max(3000),
  // Hidden field people never see; bots fill it in. Accepted here so the
  // action can quietly ignore them instead of telling them what went wrong.
  website: z.string().max(500).optional(),
});

export type EnquirySchema = z.input<typeof enquirySchema>;
