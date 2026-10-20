export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;

  name: string;
  surname: string;
  fullName: string;

  gender: "MALE" | "FEMALE";

  phone?: string | null;
  email?: string | null;

  status: string;

  className: string;
  academicYear: string;
  admissionDate?: Date | null;

  parentName: string;
  parentPhone?: string | null;
  birthday?: Date | null;

  bloodType: string;

  address: string;

  parentEmail?: string | null;

  image?: string | null;

  attendancePercentage?: number;

  dueAmount?: number;
}

export interface StudentSummary {
  totalStudents: number;
  newAdmissions: number;
  boys: number;
  girls: number;
}
