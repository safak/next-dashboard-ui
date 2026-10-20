import prisma from "@/lib/prisma";

export interface AdmissionStudent {
  id: string;

  admissionNo: string;

  rollNo: string;

  studentName: string;

  classId: number;
  className: string;

  parentName: string;
  phone: string;

  status: string;

  createdAt: Date;
}

export interface AdmissionRegisterSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface AdmissionRegisterData {
  academicYear: {
    id: number;
    label: string;
  } | null;

  classes: {
    id: number;
    name: string;
  }[];

  students: AdmissionStudent[];

  summary: AdmissionRegisterSummary;
}

export interface AdmissionDetails {
  id: string;

  admissionNo: string;

  rollNo: string;

  status: string;

  createdAt: Date;

  academicYear: {
    id: number;
    label: string;
  };

  class: {
    id: number;
    name: string;
  };

  student: {
    id: string;
    name: string;
    surname: string;
    fullName: string;
    birthday: Date | null;
    bloodType: string;
    sex: string;
    img: string | null;
  };

  parent: {
    id: string;
    name: string;
    surname: string;
    fullName: string;
    username: string;
    phone: string;
    email: string | null;
    address: string;
  };
}

export async function getAdmissionRegister(): Promise<AdmissionRegisterData> {
  /* ==========================================================
     ACTIVE ACADEMIC YEAR
  ========================================================== */

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      label: true,
    },
  });

  if (!academicYear) {
    return {
      academicYear: null,

      classes: [],

      students: [],

      summary: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    };
  }

  /* ==========================================================
     ADMISSION REGISTER DATA
  ========================================================== */

  const [classes, totalAdmissions, admissionRegister] = await Promise.all([
    prisma.class.findMany({
      where: {
        academicYearId: academicYear.id,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.student.count({
      where: {
        academicYearId: academicYear.id,
      },
    }),

    prisma.student.findMany({
      where: {
        academicYearId: academicYear.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        admissionNo: true,
        rollNo: true,
        name: true,
        surname: true,
        status: true,
        createdAt: true,

        class: {
          select: {
            id: true,
            name: true,
          },
        },

        parent: {
          select: {
            name: true,
            surname: true,
            phone: true,
          },
        },
      },
    }),
  ]);

  /* ==========================================================
     ADMISSION REGISTER
  ========================================================== */

  const students: AdmissionStudent[] = admissionRegister.map((student) => ({
    id: student.id,

    admissionNo: student.admissionNo,

    rollNo: student.rollNo,

    studentName: `${student.name} ${student.surname}`,

    classId: student.class.id,
    className: student.class.name,

    parentName: `${student.parent.name} ${student.parent.surname}`,

    phone: student.parent.phone,

    status: student.status,

    createdAt: student.createdAt,
  }));

  /**
   * Temporary summary values.
   * These can later be replaced with actual admission workflow counts.
   */
  const pending = 0;
  const approved = totalAdmissions;
  const rejected = 0;

  return {
    academicYear,

    classes,

    students,

    summary: {
      total: totalAdmissions,
      pending,
      approved,
      rejected,
    },
  };
}

export async function getAdmissionDetails(
  studentId: string,
): Promise<AdmissionDetails | null> {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },

    select: {
      id: true,

      admissionNo: true,

      rollNo: true,

      status: true,

      createdAt: true,

      name: true,
      surname: true,
      birthday: true,
      bloodType: true,
      sex: true,
      img: true,

      class: {
        select: {
          id: true,
          name: true,
        },
      },

      academicYear: {
        select: {
          id: true,
          label: true,
        },
      },

      parent: {
        select: {
          id: true,
          name: true,
          surname: true,
          username: true,
          phone: true,
          email: true,
          address: true,
        },
      },
    },
  });

  if (!student) {
    return null;
  }

  return {
    id: student.id,

    admissionNo: student.admissionNo,

    rollNo: student.rollNo,

    status: student.status,

    createdAt: student.createdAt,

    academicYear: student.academicYear,

    class: student.class,

    student: {
      id: student.id,

      name: student.name,

      surname: student.surname,

      fullName: `${student.name} ${student.surname}`,

      birthday: student.birthday,

      bloodType: student.bloodType,

      sex: student.sex,

      img: student.img,
    },

    parent: {
      id: student.parent.id,

      name: student.parent.name,

      surname: student.parent.surname,

      fullName: `${student.parent.name} ${student.parent.surname}`,

      username: student.parent.username,

      phone: student.parent.phone,

      email: student.parent.email,

      address: student.parent.address,
    },
  };
}
