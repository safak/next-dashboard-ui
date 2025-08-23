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
  // Après la création des autres entités dans main()

// Récupérer les classes, subjects, périodes, et l'année scolaire
const classes = await prisma.class.findMany();
const subjects = await prisma.subject.findMany();
const allPeriods  = await prisma.period.findMany();
const schoolYearDb = await prisma.schoolYear.findFirst({ where: { label: "2024-2025" } });

if (!schoolYearDb) throw new Error("School year not found");

// Création de fiches exemples (10 fiches)
// 1. Récupération après la création de tous les étudiants, cours, classes, périodes
const students = await prisma.student.findMany(); // 👈 Assure-toi que ceci est déclaré ici

if (!schoolYearDb) throw new Error("School year not found");

// 2. Ensuite on peut créer les fiches
for (let i = 0; i < 10; i++) {
  const classe = classes[i % classes.length];
  const subject = subjects[i % subjects.length];
  const period = allPeriods[i % allPeriods.length];

  // Trouver les étudiants de la classe
  const classStudents = students.filter((s) => s.classId === classe.id);

  const notes = classStudents.map((student) => ({
    cours: subject.name,
    nom: student.name,
    postnom: student.surname,
    prenom: student.username,
    sexe: student.sex,
    score: Math.floor(Math.random() * 41) + 60,
    maxscore: subject.maxScore,
  }));

  await prisma.fiche.create({
    data: {
      classeName: classe.name,
      coursId: subject.id,
      coursName: subject.name,
      classId: classe.id,
      periodeName: period.label,
      periodId: period.id,
      anneeName: schoolYearDb.label,
      anneeId: schoolYearDb.id,
      notes,
    },
  });
}

// Après la création des leçons (lessons), élèves (students), etc.

const lessons = await prisma.lesson.findMany();


// Seed Exams
for (let i = 0; i < 10; i++) {
  const lesson = lessons[i % lessons.length];
  await prisma.exam.create({
    data: {
      title: `Examen-${i + 1}`,
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 60 * 60 * 1000),
      lessonId: lesson.id,
    },
  });
}

// Seed Assignments
for (let i = 0; i < 10; i++) {
  const lesson = lessons[(i + 5) % lessons.length];

  await prisma.assignment.create({
    data: {
      title: `Devoir-${i + 1}`,
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      lessonId: lesson.id, // Corrigé dynamiquement
    },
  });
}


// Récupérer les exams et assignments fraîchement créés
const exams = await prisma.exam.findMany();
const assignments = await prisma.assignment.findMany();

// Seed Attendances
for (let i = 0; i < 20; i++) {
  const student = students[i % students.length];
  const lesson = lessons[i % lessons.length];
  await prisma.attendance.create({
    data: {
      date: new Date(Date.now() + 60 * 60 * 1000),
      present: i % 3 !== 0, // Présent 2 fois sur 3
      studentId: student.id,
      lessonId: lesson.id,
    },
  });
}

// Seed Events

for (let i = 0; i < 5; i++) {
  const classItem = classes[i % classes.length];
  await prisma.event.create({
    data: {
      title: `Evénement-${i + 1}`,
      description: `Description de l'événement numéro ${i + 1}`,
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      classId: classItem.id,
    },
  });
}
// Seed Announcements
for (let i = 0; i < 5; i++) {
  const classItem = classes[i % classes.length];
  await prisma.announcement.create({
    data: {
      title: `Annonce Importante ${i + 1}`,
      description: `Description de l'annonce numéro ${i + 1}`,
      date: new Date(Date.now() + 60 * 60 * 1000),
      classId: classItem.id,
    },
  });
}

// Seed Results for exams (each student gets a random score for some exams)
for (let i = 0; i < students.length; i++) {
  const student = students[i];
  // Pour chaque étudiant, on lui associe un résultat à un ou deux examens aléatoires
  const exam1 = exams[i % exams.length];
  const exam2 = exams[(i + 1) % exams.length];

  await prisma.result.create({
    data: {
      score: Math.floor(Math.random() * 41) + 60, // Note entre 60 et 100
      examId: exam1.id,
      studentId: student.id,
    },
  });

  await prisma.result.create({
    data: {
      score: Math.floor(Math.random() * 41) + 60,
      examId: exam2.id,
      studentId: student.id,
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
