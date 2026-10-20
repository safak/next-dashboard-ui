"use client";

import Image from "next/image";

interface Student {
  id: string;
  admissionNo: string;
  rollNo: number;
  name: string;
  surname: string;
  img: string | null;

  class: {
    id: number;
    name: string;
  };
}

interface Props {
  students: Student[];

  selectedStudents: string[];

  onToggleStudent: (id: string) => void;

  onToggleAll: () => void;
}

export default function PromotionStudentTable({
  students,
  selectedStudents,
  onToggleStudent,
  onToggleAll,
}: Props) {
  if (students.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
        Select an academic year and class to view eligible students.
      </div>
    );
  }

  const allSelected =
    students.length > 0 &&
    selectedStudents.length === students.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Eligible Students
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {students.length} student
            {students.length > 1 ? "s" : ""} found
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          Selected : {selectedStudents.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="w-14 px-6 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Roll No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Admission No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Student
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Current Class
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => onToggleStudent(student.id)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-slate-700">
                  {student.rollNo}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {student.admissionNo}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                      <Image
                        src={student.img || "/noAvatar.png"}
                        alt={student.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <p className="font-medium text-slate-800">
                        {student.name} {student.surname}
                      </p>

                      <p className="text-xs text-slate-500">
                        {student.admissionNo}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                    {student.class.name}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}