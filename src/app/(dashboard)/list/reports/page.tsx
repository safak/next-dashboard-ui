import prisma from "@/lib/prisma";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  Mark,
  Period,
  Semester,
  Subject,
  Student,
  Class,
  Prisma,
} from "@prisma/client";
import { MultiSelectWithSelectStyle } from "@/components/MultiSelectWithSelectStyle";

type MarkWithRelations = Mark & {
  student: Student & { class: Class };
  subject: Subject;
  period: Period & { semester: Semester };
};

const columns = [
  { header: "Élève (Classe)", accessor: "student" },
  { header: "Cours", accessor: "subject" },
  { header: "Période", accessor: "period" },
  { header: "Note / Max", accessor: "note" },
  { header: "Normalisée (%)", accessor: "norm" },
];

export default async function StudentReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const { page, semesterId, studentId, periodId, classId } = resolvedParams;

  const p = page ? parseInt(page) : 1;

  // Traitement des paramètres
  const semesterIds = semesterId?.split(",").filter(Boolean).map(Number) ?? [];
  const studentIds = studentId?.split(",").filter(Boolean) ?? [];
  const periodIds = periodId?.split(",").filter(Boolean).map(Number) ?? [];
  const classIds = classId?.split(",").filter(Boolean).map(Number) ?? [];

  // Construction de la requête Prisma
  const query: Prisma.MarkWhereInput = {};

  if (semesterIds.length > 0) {
    query.period = {
      semesterId: { in: semesterIds },
    };
  }

  if (studentIds.length > 0) {
    query.studentId = { in: studentIds };
  }

  if (periodIds.length > 0) {
    query.periodId = { in: periodIds };
  }

  if (classIds.length > 0) {
    query.student = {
      classId: { in: classIds },
    };
  }

  // Chargement des données
  const [data, count, semesters, students, periods, classes] = await Promise.all([
    prisma.mark.findMany({
      where: query,
      include: {
        student: { include: { class: true } },
        subject: true,
        period: { include: { semester: true } },
      },
      orderBy: { period: { startDate: "asc" } },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.mark.count({ where: query }),
    prisma.semester.findMany({
      select: { id: true, label: true, startDate: true, endDate: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.student.findMany({
      select: { id: true, name: true, surname: true },
      orderBy: { name: "asc" },
    }),
    prisma.period.findMany({
      select: { id: true, label: true },
      orderBy: { startDate: "asc" },
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Options pour les filtres
  const semesterOptions = semesters.map((s) => ({
    id: s.id.toString(),
    name: s.label ?? "Semestre",
  }));

  const studentOptions = students.map((s) => ({
    id: s.id,
    name: `${s.name} ${s.surname}`,
  }));

  const periodOptions = periods.map((p) => ({
    id: p.id.toString(),
    name: p.label,
  }));

  const classOptions = classes.map((c) => ({
    id: c.id.toString(),
    name: c.name,
  }));

  const renderRow = (mark: MarkWithRelations) => {
    const normalizedScore = +(
      (mark.score / mark.subject.maxScore) *
      100
    ).toFixed(2);
    return (
      <tr key={mark.id} className="border-b even:bg-slate-50 text-sm">
        <td>
          {mark.student.name} {mark.student.surname}
          <br />
          <span className="text-xs text-gray-500">{mark.student.class.name}</span>
        </td>
        <td>{mark.subject.name}</td>
        <td>{mark.period.label}</td>
        <td>
          {mark.score}/{mark.subject.maxScore}
        </td>
        <td>{normalizedScore}%</td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <MultiSelectWithSelectStyle
          label="Semestre"
          param="semesterId"
          options={semesterOptions}
        />
        <MultiSelectWithSelectStyle
          label="Élève"
          param="studentId"
          options={studentOptions}
        />
        <MultiSelectWithSelectStyle
          label="Période"
          param="periodId"
          options={periodOptions}
        />
        <MultiSelectWithSelectStyle
          label="Classe"
          param="classId"
          options={classOptions}
        />
      </div>

      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">
          Bulletin –{" "}
          {semesterIds.length > 0
            ? "Filtré par semestre"
            : "Tous les semestres"}
        </h1>
        <TableSearch />
      </div>

      {/* Tableau des notes */}
      <Table columns={columns} data={data} renderRow={renderRow} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
}
