import { PrismaClient, UserSex, Day } from '@prisma/client';
import { hash } from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Create Admins

const prisma = new PrismaClient();
  const hashedPassword = await hash("monmotdepasse", 10);
  
  // 1. Créer les rôles
await Promise.all(
  ["admin", "user"].map((name) =>
    prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  )
);

// 2. Récupérer le rôle "user"
const role = await prisma.role.findFirst({ where: { name: "user" } });
if (!role) throw new Error("Role 'user' not found");

await prisma.user.create({
  data: {
    email: "test@exemple.com",
    name: "Test User",
    password: hashedPassword,
    roleId: role.id,
  },
});



  // Create School Year
  const schoolYear = await prisma.schoolYear.create({
    data: {
      label: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
    },
  });

  // Create Semesters
  const semester1 = await prisma.semester.create({
    data: {
      label: "Semestre 1",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-01-15"),
    },
  });

  const semester2 = await prisma.semester.create({
    data: {
      label: "Semestre 2",
      startDate: new Date("2025-01-16"),
      endDate: new Date("2025-06-30"),
    },
  });

  // Create Periods
  const periods = await prisma.period.createMany({
    data: [
      {
        label: "Période 1",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-11-15"),
        semesterId: semester1.id,
      },
      {
        label: "Période 2",
        startDate: new Date("2024-11-16"),
        endDate: new Date("2025-01-15"),
        semesterId: semester1.id,
      },
      {
        label: "Période 3",
        startDate: new Date("2025-01-16"),
        endDate: new Date("2025-03-30"),
        semesterId: semester2.id,
      },
      {
        label: "Période 4",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-06-30"),
        semesterId: semester2.id,
      },
    ],
  });

  // Create Grades & Classes
  for (let i = 1; i <= 6; i++) {
    const grade = await prisma.grade.create({
      data: { label: i },
    });

    await prisma.class.create({
      data: {
        id: i,
        name: `${i}A`,
        gradeId: grade.id,
        capacity: Math.floor(Math.random() * (25 - 20 + 1)) + 20,
      },
    });
  }

  // Create Subjects
  const subjectNames = [
    "Mathematique", "Science", "Anglais", "Histoire", "Geographie",
    "Physique", "Chimie", "Biologie", "Computer Science", "Art"
  ];
  for (const name of subjectNames) {
    await prisma.subject.create({ data: { name } });
  }

  // Create Teachers
  for (let i = 1; i <= 10; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher-${i}`,
        username: `ndoy${i}`,
        name: `Kilem-${i}`,
        surname: `Weber-${i}`,
        email: `kilem${i}@gmail.com`,
        phone: `844952960${i}`,
        address: `Address-${i}`,
        img: `weber-${i}.png`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.Male : UserSex.Female,
        subjects: {
          connect: [{ id: (i % subjectNames.length) + 1 }],
        },
        classes: {
          connect: [{ id: (i % 6) + 1 }],
        },
      },
    });
  }

  // Create Lessons
  for (let i = 1; i <= 15; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson-${i}`,
        day: Day[Object.keys(Day)[i % 5] as keyof typeof Day],
        startTime: new Date("2024-09-10T08:00:00"),
        endTime: new Date("2024-09-10T09:00:00"),
        subjecId: (i % subjectNames.length) + 1,
        classId: (i % 6) + 1,
        teacherId: `teacher-${(i % 10) + 1}`,
      },
    });
  }

  // Create Parents
  for (let i = 1; i <= 15; i++) {
    await prisma.parent.create({
      data: {
        id: `parent-${i}`,
        username: `parent${i}`,
        name: `NomParent-${i}`,
        surname: `Prenom-${i}`,
        email: `parent${i}@gmail.com`,
        phone: `84500000${i}`,
        address: `Quartier ${i}`,
      },
    });
  }

  // Create Students
  for (let i = 1; i <= 15; i++) {
    await prisma.student.create({
      data: {
        id: `student-${i}`,
        username: `etu${i}`,
        name: `Eleve-${i}`,
        surname: `Test-${i}`,
        email: `student${i}@gmail.com`,
        phone: `84600000${i}`,
        address: `Adresse-${i}`,
        img: `student-${i}.png`,
        bloodType: "O+",
        sex: i % 2 === 0 ? UserSex.Male : UserSex.Female,
        classId: (i % 6) + 1,
        gradeId: (i % 6) + 1,
        parentId: `parent-${(i % 15) + 1}`,
      },
    });
  }

  // Create Marks
  for (let i = 1; i <= 15; i++) {
    await prisma.mark.create({
      data: {
        studentId: `student-${i}`,
        subjectId: (i % subjectNames.length) + 1,
        periodId: (i % 4) + 1,
        score: Math.floor(Math.random() * 41) + 60,
        schoolYearId: schoolYear.id,
      },
    });
  }

  // Create Fees
  for (let i = 1; i <= 5; i++) {
    await prisma.fee.create({
      data: {
        label: `Frais ${i}`,
        amount: 50000 + i * 1000,
        category: "GENERAL",
        isActive: true,
        schoolYearId: schoolYear.id,
      },
    });
  }

  // Create Payments
  for (let i = 1; i <= 15; i++) {
    await prisma.payment.create({
      data: {
        studentId: `student-${i}`,
        feeId: (i % 5) + 1,
        amount: 50000,
        schoolYearId: schoolYear.id,
      },
    });
  }
}

main()
  .then(() => {
    console.log("✅ Seed complete!");
  })
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
