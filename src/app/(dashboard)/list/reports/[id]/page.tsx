import prisma from "@/lib/prisma";
import { average } from "@/lib/utils";
import Table from "@/components/Table";
import { notFound } from "next/navigation";

type ReportData = {
  studentName: string;
  studentId: string;
  periodAverages: Record<string, number>;
  semesterAverages: Record<string, number>;
  annualAverage: number;
};

export default async function StudentReportPage({
  searchParams,
}: {
  searchParams: { studentId?: string };
}) {
  const studentId = searchParams.studentId;

  if (!studentId) return notFound();

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { name: true, surname: true },
  });

  if (!student) return notFound();

  const marks = await prisma.mark.findMany({
    where: { studentId },
    include: {
      period: { include: { semester: true } },
      subject: true,
    },
    orderBy: {
      period: { startDate: "asc" },
    },
  });

  // Regroupement
  const periodMarks: Record<string, number[]> = {};
  const semesterMarks: Record<string, number[]> = {};
  const allScores: number[] = [];

  for (const mark of marks) {
    const period = mark.period.label;
    const semester = mark.period.semester.label;
    const score = mark.score;

    if (!periodMarks[period]) periodMarks[period] = [];
    periodMarks[period].push(score);

    if (!semesterMarks[semester]) semesterMarks[semester] = [];
    semesterMarks[semester].push(score);

    allScores.push(score);
  }

  const periodAverages = Object.fromEntries(
    Object.entries(periodMarks).map(([label, scores]) => [label, average(scores)])
  );

  const semesterAverages = Object.fromEntries(
    Object.entries(semesterMarks).map(([label, scores]) => [label, average(scores)])
  );

  const annualAverage = average(allScores);

  const report: ReportData = {
    studentName: `${student.name} ${student.surname}`,
    studentId,
    periodAverages,
    semesterAverages,
    annualAverage,
  };

  return (
    <div className="p-6 bg-white rounded-md m-4 shadow-md">
      <h1 className="text-xl font-bold mb-4">Fiche de cotation</h1>
      <h2 className="mb-2 text-gray-700 font-medium">Élève : {report.studentName}</h2>

      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-kalasaPurple">📅 Moyennes par période</h3>
        <ul className="mb-4 list-disc list-inside text-sm">
          {Object.entries(report.periodAverages).map(([period, avg]) => (
            <li key={period}>
              <strong>{period}</strong> : {avg} / 100
            </li>
          ))}
        </ul>

        <h3 className="font-semibold mb-2 text-kalasaPurple">🗓️ Moyennes par semestre</h3>
        <ul className="mb-4 list-disc list-inside text-sm">
          {Object.entries(report.semesterAverages).map(([sem, avg]) => (
            <li key={sem}>
              <strong>{sem}</strong> : {avg} / 100
            </li>
          ))}
        </ul>

        <h3 className="font-semibold mb-2 text-kalasaPurple">📊 Moyenne annuelle</h3>
        <p className="text-sm">{report.annualAverage} / 100</p>
      </div>
    </div>
  );
}
