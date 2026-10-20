"use client";

import { CalendarDays, ClipboardCheck } from "lucide-react";
import ExamRowActions from "./ExamRowActions";
import type { ExamWithRelations } from "../types";

interface ExamsTableProps {
  exams: ExamWithRelations[];
  onEdit: (exam: ExamWithRelations) => void;
  onDelete: (exam: ExamWithRelations) => void;
}

function getExamStatus(examDate: Date | string) {
  const today = new Date();
  const date = new Date(examDate);

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() < today.getTime()) {
    return {
      label: "Completed",
      className:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    };
  }

  if (date.getTime() === today.getTime()) {
    return {
      label: "Today",
      className:
        "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    };
  }

  return {
    label: "Upcoming",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  };
}

export default function ExamsTable({
  exams,
  onEdit,
  onDelete,
}: ExamsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Exam
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Class
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subject
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Teacher
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Date
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Marks
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {exams.map((exam) => {
              const status = getExamStatus(exam.examDate);

              return (
                <tr
                  key={exam.id}
                  className="transition hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold">
                        {exam.title}
                      </p>

                      {exam.description && (
                        <p className="mt-0.5 max-w-[250px] truncate text-xs text-muted-foreground">
                          {exam.description}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {exam.class.name}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                      {exam.subject.name}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {exam.teacher.name} {exam.teacher.surname}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />

                      {new Date(exam.examDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    {exam.totalMarks}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <ExamRowActions
                      onEdit={() => onEdit(exam)}
                      onDelete={() => onDelete(exam)}
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