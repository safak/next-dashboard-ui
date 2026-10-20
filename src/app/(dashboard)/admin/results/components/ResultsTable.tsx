"use client";

import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";

import ResultRowActions from "./ResultRowActions";

import type { ResultWithRelations } from "../types";

interface ResultsTableProps {
  results: ResultWithRelations[];

  onEdit: (result: ResultWithRelations) => void;

  onDelete: (result: ResultWithRelations) => void;
}

export default function ResultsTable({
  results,
  onEdit,
  onDelete,
}: ResultsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Student
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Class
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Assessment
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Score
              </th>

              <th className="w-16 px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => {
              const assessment =
                result.exam?.title ?? result.assignment?.title ?? "—";

              const totalMarks =
                result.exam?.totalMarks ?? result.assignment?.totalMarks ?? 0;

              const isExam = Boolean(result.examId);

              return (
                <tr
                  key={result.id}
                  className="group border-b border-slate-100 transition-colors duration-150 last:border-b-0 hover:bg-indigo-50/30"
                >
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                        <GraduationCap className="h-4 w-4 text-violet-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {result.student.name} {result.student.surname}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-2.5">
                    <span className="text-sm font-medium text-slate-700">
                      {result.student.class?.name ?? "—"}
                    </span>
                  </td>

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        {isExam ? (
                          <ClipboardList className="h-4 w-4 text-blue-600" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-green-600" />
                        )}
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {assessment}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-2.5">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isExam
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {isExam ? "Exam" : "Assignment"}
                    </span>
                  </td>

                  <td className="px-5 py-2.5">
                    <div>
                      <span className="text-sm font-bold text-slate-800">
                        {result.score}
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        / {totalMarks}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-right">
                    <ResultRowActions
                      result={result}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
