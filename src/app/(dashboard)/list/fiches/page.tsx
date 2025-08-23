import { notFound } from "next/navigation";
import { getUserSessionInfo } from "@/lib/session";
import prisma from "@/lib/prisma";
import FicheFilterClient from "@/components/FicheSelect";
import Table from "@/components/Table";
import ExportButtons from "@/components/ExportButtons";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";

type NoteRow = {
  nom: string;
  studentSurname: string;
  studentusername: string;
  studentSexe: string;
  score: number;
  maxScore: number;
  key: string;
};

const columns = [
  { header: "Nom", accessor: "nom" },
  { header: "Postnom", accessor: "studentSurname" },
  { header: "Prenom", accessor: "studentusername" },
  { header: "Sexe", accessor: "studentSexe" },
  { header: "Note", accessor: "score" },
  { header: "Max", accessor: "maxScore" },
];


export default async function FichePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, currentUserId } = await getUserSessionInfo();
  if (!role || !currentUserId) notFound();

  const resolvedParams = await searchParams;
  const { page, classId, subjectId, periodId } = resolvedParams;
  const p = page ? parseInt(page) : 1;

  const classIdInt = classId ? parseInt(classId) : undefined;
  const subjectIdInt = subjectId ? parseInt(subjectId) : undefined;
  const periodIdInt = periodId ? parseInt(periodId) : undefined;

  const [classes, subjects, periodes, fiches] = await Promise.all([
    prisma.class.findMany({ orderBy: { name: "asc" } }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.period.findMany({ orderBy: { label: "asc" } }),
    prisma.fiche.findMany({
      where: {
        ...(classIdInt && { classId: classIdInt }),
        ...(subjectIdInt && { coursId: subjectIdInt }),
        ...(periodIdInt && { periodId: periodIdInt }),
      },
      include: {
        class: true,
        period: true,
        cours: true,
      },
      orderBy: { dateCreated: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
  ]);

  const count = await prisma.fiche.count({
    where: {
      ...(classIdInt && { classId: classIdInt }),
      ...(subjectIdInt && { coursId: subjectIdInt }),
      ...(periodIdInt && { periodId: periodIdInt }),
    },
  });

  const notes: NoteRow[] = fiches
    .flatMap((fiche) => {
      if (!fiche.notes || !Array.isArray(fiche.notes)) return [];
      let num = 0;
      return fiche.notes.map((note: any, index: number) => ({
        key: `${fiche.id}-${index}`, // clé unique
        nom: note.nom,
        studentSurname: note.postnom,
        studentusername: note.prenom,
        studentSexe: note.sexe,
        score: note.score,
        maxScore: note.maxscore,
      }));
    })
    .sort((a, b) => (a.nom ?? "").localeCompare(b.nom ?? ""));

  const renderRow = (note: NoteRow) => (
    <tr key={note.key} className="border-b even:bg-slate-50 text-sm">
      <td>{note.nom}</td>
      <td>{note.studentSurname}</td>
      <td>{note.studentusername}</td>
      <td>{note.studentSexe}</td>
      <td>{note.score}</td>
      <td>{note.maxScore}</td>
    </tr>
  );

  const meta = fiches.length > 0 ? {
  className: fiches[0].class.name,
  subjectName: fiches[0].cours.name,
  periodLabel: fiches[0].period.label,
} : undefined;


  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between m-2">
        <h1 className="hidden md:block text-lg font-semibold m">
          Fiche des Notes
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/*  <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
           <ExportButtons data={notes} columns={columns} meta={meta}/>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
              <Image src="/uploads/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
              <Image src="/uploads/sors.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <FicheFilterClient
        classId={classIdInt}
        subjectId={subjectIdInt}
        periodId={periodIdInt}
        classes={classes.map((c) => ({ id: c.id, name: c.name }))}
        subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
        periodes={periodes.map((p) => ({ id: p.id, name: p.label }))}
      />

      {/* Tableau */}
      <Table columns={columns} data={notes} renderRow={renderRow} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
}
