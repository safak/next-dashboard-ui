import { z, ZodType } from "zod";
import { TermType } from "@prisma/client";
import { AnnouncementPriority } from "@prisma/client";

// Class
export const classSchema = z.object({
  id: z.number().optional(),

  name: z.string().trim().min(1, "Class name is required"),

  capacity: z.coerce
    .number({
      message: "Capacity is required",
    })
    .min(1, "Capacity must be at least 1"),

  rollPrefix: z.coerce
    .number({
      message: "Roll prefix is required",
    })
    .min(1, "Roll prefix must be greater than 0"),

  gradeId: z.number().optional(),

  supervisorId: z
    .string({
      message: "Class teacher is required",
    })
    .min(1, "Class teacher is required"),
});

export type ClassFormInput = z.input<typeof classSchema>;
export type ClassSchema = z.infer<typeof classSchema>;

// Lesson
export const lessonSchema = z
  .object({
    id: z.number().optional(),

    name: z.string().min(1, "Lesson name is required"),

    scheduleDate: z.date({
      message: "Schedule date is required",
    }),

    day: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]),

    startTime: z.date({
      message: "Start time is required",
    }),

    endTime: z.date({
      message: "End time is required",
    }),

    subjectId: z.number().min(1, "Subject is required"),

    classId: z.number().min(1, "Class is required"),

    teacherId: z.string().min(1, "Teacher is required"),
  })
  .refine((data) => data.endTime.getTime() > data.startTime.getTime(), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type LessonFormValues = z.infer<typeof lessonSchema>;

// Subject
export const subjectSchema = z.object({
  id: z.number().optional(),

  name: z.string().min(1, "Subject name is required"),

  teachers: z.array(z.string()).min(1, "At least one teacher must be assigned"),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

// Teacher
export const teacherSchema = z.object({
  id: z.string().optional(),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^\S+$/, "Username cannot contain spaces"),

  email: z.string().email("Invalid email address").or(z.literal("")),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain 1 uppercase letter")
    .regex(/[a-z]/, "Must contain 1 lowercase letter")
    .regex(/[0-9]/, "Must contain 1 number")
    .or(z.literal("")),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),

  name: z.string().min(1, "First name is required"),

  surname: z.string().min(1, "Last name is required"),

  address: z.string().min(1, "Address is required"),

  bloodType: z.string().min(1, "Blood type is required"),

  birthday: z.date().optional(),

  sex: z.enum(["MALE", "FEMALE"], {
    message: "Sex is required",
  }),

  img: z.string().optional(),

  subjects: z.array(z.string()).optional(),

  supervisedClasses: z.array(z.string()).optional(),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;

// Student
export const studentSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1, "First name is required"),

  surname: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email address").optional().or(z.literal("")),

  phone: z.string().min(10, "Phone number is required"),

  address: z.string().min(1, "Address is required"),

  img: z.string().optional(),

  bloodType: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),

  sex: z.enum(["MALE", "FEMALE"]),

  birthday: z.preprocess((value) => {
    if (!value || value === "") {
      return undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    const date = new Date(String(value));

    return Number.isNaN(date.getTime()) ? undefined : date;
  }, z.date().optional()),

  classId: z.coerce.number().int().min(1, "Class is required"),

  parentId: z.string().min(1, "Parent is required"),

  feeStructureId: z.coerce.number().int().min(1, "Fee structure is required"),

  discount: z.coerce.number().int().min(0, "Discount cannot be negative"),

  paidAmount: z.coerce.number().int().min(0, "Paid amount cannot be negative"),
});

export type StudentFormInput = z.input<typeof studentSchema>;

export type StudentFormValues = z.output<typeof studentSchema>;

// Parent
export const parentSchema = z
  .object({
    id: z.string().optional(),

    username: z.string().min(1, "Username is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),

    name: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Last name is required"),

    email: z.string().email("Invalid email").optional().or(z.literal("")),

    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.password) {
      ctx.addIssue({
        path: ["password"],
        message: "Password is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ParentFormValues = z.infer<typeof parentSchema>;

// Exam
export const examSchema = z.object({
  id: z.coerce.number().optional(),

  title: z.string().trim().min(1, "Exam title is required"),

  description: z.string().optional().or(z.literal("")),

  totalMarks: z.coerce.number().int().min(1, "Total marks must be at least 1"),

  examDate: z.coerce.date({
    message: "Exam date is required",
  }),

  classId: z.coerce.number().int().positive("Class is required"),

  subjectId: z.coerce.number().int().positive("Subject is required"),

  teacherId: z.string().min(1, "Teacher is required"),
});

export type ExamFormInput = z.input<typeof examSchema>;
export type ExamSchema = z.output<typeof examSchema>;
export type ExamFormValues = z.output<typeof examSchema>;

// Assignment

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),

  title: z.string().min(1, "Title is required"),

  totalMarks: z.coerce
    .number()
    .int()
    .positive("Total marks must be greater than zero"),

  startDate: z.coerce.date({
    message: "Start Date is required",
  }),

  dueDate: z.coerce.date({
    message: "Due Date is required",
  }),

  classId: z.coerce.number().int().positive("Class is required"),

  subjectId: z.coerce.number().int().positive("Subject is required"),

  teacherId: z.string().min(1, "Teacher is required"),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

// Result
export const resultSchema = z
  .object({
    id: z.coerce.number().optional(),

    score: z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          message: "Score is required",
        })
        .min(0, "Score must be at least 0")
        .max(100, "Score cannot exceed 100"),
    ),

    studentId: z.string().min(1, "Student is required"),

    examId: z.coerce.number().optional(),

    assignmentId: z.coerce.number().optional(),
  })
  .refine((data) => data.examId || data.assignmentId, {
    message: "Select either an exam or an assignment",
    path: ["examId"],
  });

export type ResultFormValues = z.infer<typeof resultSchema>;

// Attendance
export const normalizeDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),

  studentId: z.string().min(1, "Student is required"),

  lessonId: z.coerce.number({
    message: "Lesson is required",
  }),

  date: z.coerce.date({ message: "Date is required" }).transform(normalizeDate), // ⭐ IMPORTANT

  present: z.coerce.boolean(),
});

export type AttendanceFormInput = z.input<typeof attendanceSchema>;
export type AttendanceFormValues = z.infer<typeof attendanceSchema>;

// Fee
export const FeeSchema = z.object({
  id: z.number().optional(),

  title: z
    .string()
    .min(1, "Fee title is required")
    .max(100, "Fee title is too long"),

  amount: z.coerce
    .number()
    .int("Amount must be a whole number")
    .positive("Amount must be greater than 0"),

  classId: z.coerce.number().nullable().optional(),

  isActive: z.boolean().optional().default(true),
});

export type FeeFormInput = z.input<typeof FeeSchema>;
export type FeeSchemaType = z.output<typeof FeeSchema>;

// Fee Structure

export const feeStructureSchema = z.object({
  id: z.number().optional(),

  classId: z.coerce.number().min(1, "Class is required"),

  title: z.string().min(1, "Fee title is required"),

  annualFee: z.coerce
    .number()
    .int()
    .min(1, "Annual fee must be greater than 0"),

  admissionFee: z.coerce
    .number()
    .int()
    .min(0, "Admission fee cannot be negative")
    .default(11500),

  isActive: z.boolean().default(true),
});

export type FeeStructureFormInput = z.input<typeof feeStructureSchema>;

export type FeeStructureFormValues = z.output<typeof feeStructureSchema>;

// Assign Fee / Student Fee Plan
export const assignFeeSchema = z.object({
  studentId: z.string().min(1, "Student is required."),

  classId: z.coerce.number().int().positive("Class is required."),

  academicYearId: z.coerce
    .number()
    .int()
    .positive("Academic year is required."),

  totalFee: z.coerce
    .number()
    .int()
    .positive("Total fee must be greater than 0."),

  admissionDueDate: z.date().optional(),

  term1DueDate: z.date().optional(),

  term2DueDate: z.date().optional(),
});

export type AssignFeeFormInput = z.input<typeof assignFeeSchema>;

export type AssignFeeValues = z.output<typeof assignFeeSchema>;

// Announcement
export type AnnouncementSchema = {
  id?: number;
  title: string;
  description: string;
  priority: AnnouncementPriority;
  publishDate: Date;
  expiryDate?: Date | null;
  isPublished: boolean;
  classId: string | null;
};

export const announcementFormSchema = z.object({
  id: z.number().optional(),

  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),

  description: z.string().trim().min(1, "Description is required"),

  priority: z.nativeEnum(AnnouncementPriority, {
    message: "Priority is required",
  }),

  publishDate: z.date({
    message: "Publish date is required",
  }),

  expiryDate: z.date().nullable().optional(),

  isPublished: z.boolean(),

  // "ALL" or a class id from the UI
  classId: z.string().nullable().optional(),
});

export type AnnouncementFormInput = z.input<typeof announcementFormSchema>;

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

// Event
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
export type EventFormValues = z.infer<typeof eventSchema>;

export const holidaySchema = z.object({
  id: z.number().optional(),

  title: z.string().min(1, "Title is required"),
  date: z.date(),

  // UI value only
  isFullDay: z.enum(["FULL", "HALF"]),
});

export type HolidayFormInput = z.input<typeof holidaySchema>;
export type HolidayFormValues = z.infer<typeof holidaySchema>;

export const homeworkSchema = z.object({
  id: z.number().optional(),

  title: z.string().min(1, "Homework title is required"),

  description: z.string().min(1, "Description is required"),

  dueDate: z.date({
    message: "Due date is required",
  }),

  classId: z.number().min(1, "Class is required"),

  subjectId: z.number().min(1, "Subject is required"),

  teacherId: z.string().min(1, "Teacher is required"),
});

export type HomeworkFormValues = z.infer<typeof homeworkSchema>;

/* ============================================================
   Student Information
============================================================ */

const studentInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50),

  surname: z.string().trim().min(1).max(50),

  birthday: z
    .date({
      error: "Date of birth is required.",
    })
    .optional(),

  bloodType: z.string().trim().min(1),

  sex: z.enum(["MALE", "FEMALE"], {
    error: "Please select gender.",
  }),

  img: z.string().optional(),
});

/* ============================================================
   Parent / Guardian Information
============================================================ */

const parentInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50),

  surname: z.string().trim().min(1, "Last name is required.").max(50),

  username: z
    .string()
    .trim()
    .min(4, "Username must be at least 4 characters.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(
      /^[A-Za-z0-9._]+$/,
      "Username can contain only letters, numbers, dot and underscore.",
    ),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(32, "Password cannot exceed 32 characters.")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character.",
    ),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .min(5, "Address is required.")
    .max(300, "Address cannot exceed 300 characters."),
});

/* Academic & Fee Information */

const academicInfoSchema = z.object({
  academicYearId: z
    .number({
      error: "Academic year is required.",
    })
    .int()
    .positive("Academic year is required."),

  classId: z
    .number({
      error: "Please select a class.",
    })
    .int()
    .positive("Please select a class."),

  feeStructureId: z
    .number({
      error: "Please select a fee structure.",
    })
    .int()
    .positive("Please select a fee structure."),

  discount: z.number().int().min(0, "Discount cannot be negative.").default(0),

  paidAmount: z
    .number()
    .int()
    .min(0, "Paid amount cannot be negative.")
    .default(0),

  admissionDueDate: z.date().optional(),

  term1DueDate: z.date().optional(),

  term2DueDate: z.date().optional(),
});

/* Uploaded Document */

export const uploadedDocumentSchema = z.object({
  originalFileName: z.string(),

  fileUrl: z.string().url(),

  publicId: z.string(),

  mimeType: z.string(),

  fileSize: z.number(),
});

/* Optional Uploaded Document */

const optionalUploadedDocumentSchema = z.preprocess((value) => {
  if (value === "") {
    return undefined;
  }

  return value;
}, uploadedDocumentSchema.optional());

/* ============================================================
   Complete Registration Schema
============================================================ */

export const studentRegistrationSchema = z.object({
  student: studentInfoSchema,

  parent: parentInfoSchema,

  academic: academicInfoSchema,

  documents: z.object({
    birthCertificate: uploadedDocumentSchema.optional(),

    studentAadhaar: uploadedDocumentSchema.optional(),

    transferCertificate: uploadedDocumentSchema.optional(),

    parentAadhaar: uploadedDocumentSchema.optional(),

    addressProof: uploadedDocumentSchema.optional(),

    vaccinationRecord: uploadedDocumentSchema.optional(),

    medicalCertificate: uploadedDocumentSchema.optional(),

    remarks: z.string().optional(),
  }),
});

/* ============================================================
   Types
============================================================ */

export type StudentRegistrationFormInput = z.input<
  typeof studentRegistrationSchema
>;

export type StudentRegistrationFormValues = z.output<
  typeof studentRegistrationSchema
>;

export const academicYearSchema = z.object({
  id: z.number().optional(),

  label: z
    .string()
    .trim()
    .min(1, "Academic year is required")
    .regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY (Example: 2026-2027)"),

  cloneFromId: z.number().optional(),

  isActive: z.boolean(),
});

export type AcademicYearSchema = z.infer<typeof academicYearSchema>;

export type AcademicYearFormInput = z.input<typeof academicYearSchema>;
