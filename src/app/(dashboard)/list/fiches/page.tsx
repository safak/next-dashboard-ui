// app/cotation/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import prisma from "@/lib/prisma";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import type { Mark, Student, Class, Subject, Period, Semester } from "@prisma/client";
import { MultiSelectWithSelectStyle } from "@/components/MultiSelectWithSelectStyle";
import toast from "react-hot-toast"; // Optionnel

type MarkWithRelations = Mark & {
  student: Student & { class: Class };
  subject: Subject;
  period: Period & { semester: Semester };
};

// Fonction serveur (Server Action) : upsert des notes
async function saveMarks(
  periodId: number,
  subjectId: number,
  scores: { studentId: string; score: number }[]
) {
  "use server";
  for (const s of scores) {
    await prisma.mark.upsert({
      where: {
        studentId_subjectId_periodId: {
          studentId: s.studentId,
          subjectId: subjectId,
          periodId: periodId,
        },
      },
      update: { score: s.score },
      create: {
        studentId: s.studentId,
        subjectId,
        periodId,
        score: s.score,
      },
    });
  }
}

export default function StudentReportPage({ searchParams }: { searchParams: { [k: string]: string } }) {
  // Paramétrages & filtrage
  const p = parseInt(searchParams.page || "1");
  const semesterIds = searchParams.semesterId?.split(",").map(Number) ?? [];
  const periodIds = searchParams.periodId?.split(",").map(Number) ?? [];
  const classIds = searchParams.classId?.split(",").map(Number) ?? [];
  const studentIds = searchParams.studentId?.split(",") ?? [];

  const [data, setData] = useState<MarkWithRelations[]>([]);
  const [students, setStudents] = useState<(Student & { class: Class })[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [isPending, start] = useTransition();

  // Initial fetch côté client (peut être migré en Server Component)
  useEffect(() => {
    const query = new URLSearchParams(searchParams as Record<string, string>).toString();
    // Environnement production : utiliser une API route ou loader
    fetch(`/api/cotation-data?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.marks);
        setStudents(json.students);
        setPeriods(json.periods);
        setClasses(json.classes);
        setSubjects(json.subjects);
        setSemesters(json.semesters);
        // Pré-remplissage des scores si déjà existants
        const initial: Record<string, string> = {};
        json.marks.forEach((m: any) => {
          initial[`${m.studentId}-${m.subjectId}-${m.periodId}`] = m.score.toString();
        });
        setScores(initial);
      });
  }, [searchParams]);

  function handleScoreChange(studentId: string, score: string) {
    setScores((prev) => ({
      ...prev,
      [`${studentId}-${searchParams.subjectId}-${searchParams.periodId}`]: score,
    }));
  }

  function handleSubmit() {
    const toSave = students.map((s) => ({
      studentId: s.id,
      score: parseFloat(scores[`${s.id}-${searchParams.subjectId}-${searchParams.periodId}`] || "0"),
    }));
    start(async () => {
      await saveMarks(
        Number(searchParams.periodId),
        Number(searchParams.subjectId),
        toSave
      );
      toast.success("Notes enregistrées!");
    });
  }

  return (
    <div className="p-8">
      {/* Filtres, tableau etc. */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <MultiSelectWithSelectStyle label="Semestre" param="semesterId" options={semesters.map((s) => ({ id: s.id.toString(), name: s.label }))} />
        <MultiSelectWithSelectStyle label="Période" param="periodId" options={periods.map((p) => ({ id: p.id.toString(), name: p.label }))} />
        <MultiSelectWithSelectStyle label="Classe" param="classId" options={classes.map((c) => ({ id: c.id.toString(), name: c.name }))} />
        <MultiSelectWithSelectStyle label="Élève" param="studentId" options={students.map((s) => ({ id: s.id, name: `${s.name} ${s.surname}` }))} />
      </div>

      <Table columns={columns} data={data} renderRow={(mark) => (
        <tr key={mark.id}>
          <td>
            {mark.student.name} {mark.student.surname} – {mark.student.class.name}
          </td>
          <td>{mark.subject.name}</td>
          <td>{mark.period.label}</td>
          <td>
            <input
              type="number"
              min={0}
              max={mark.subject.maxScore}
              value={scores[`${mark.studentId}-${mark.subjectId}-${mark.periodId}`] || ""}
              onChange={(e) => handleScoreChange(mark.studentId, e.target.value)}
              className="border rounded px-2 py-1"
            />
          </td>
          <td>{+((scores[`${mark.studentId}-${mark.subjectId}-${mark.periodId}`] || mark.score) / mark.subject.maxScore * 100).toFixed(2)}%</td>
        </tr>
      )} />

      <Pagination page={p} count={100 /* à remplacer */} />

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Enregistrement..." : "Enregistrer les notes"}
      </button>
    </div>
  );
}
