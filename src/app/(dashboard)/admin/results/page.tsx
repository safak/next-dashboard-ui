import prisma from "@/lib/prisma";

import ResultsDashboard from "./components/ResultsDashboard";

export default async function ResultsPage() {
  const [results, students, exams, assignments] = await Promise.all([
    prisma.result.findMany({
      include: {
        student: {
          include: {
            class: true,
          },
        },
        exam: true,
        assignment: true,
      },
      orderBy: {
        id: "desc",
      },
    }),

    prisma.student.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          surname: "asc",
        },
      ],
    }),

    prisma.exam.findMany({
      select: {
        id: true,
        title: true,
        totalMarks: true,
        examDate: true,
        classId: true,
        subjectId: true,
      },
      orderBy: {
        examDate: "desc",
      },
    }),

    prisma.assignment.findMany({
      select: {
        id: true,
        title: true,
        totalMarks: true,
        dueDate: true,
        classId: true,
        subjectId: true,
      },
      orderBy: {
        dueDate: "desc",
      },
    }),
  ]);

  return (
    <ResultsDashboard
      results={results}
      students={students}
      exams={exams}
      assignments={assignments}
    />
  );
}
