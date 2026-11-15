import ExtraClassAddStudent from "@/components/ExtraClassAddStudent";
import ExtraClassRegisterButton from "@/components/ExtraClassRegisterButton";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

const dayLabel = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

// Roster for one extra class; visible to admins and the class's teacher
const ExtraClassPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { userId, role } = await auth();

  const extraClass = await prisma.extraClass.findUnique({
    where: { id: parseInt(id) || -1 },
    include: {
      subject: true,
      teacher: true,
      registrations: {
        include: { student: { include: { class: true } } },
        orderBy: { student: { name: "asc" } },
      },
    },
  });
  if (!extraClass) notFound();

  const isAdmin = role === "admin";
  if (!isAdmin && !(role === "teacher" && extraClass.teacherId === userId)) {
    notFound();
  }

  const taken = extraClass.registrations.length;
  const full = taken >= extraClass.capacity;

  const addable = isAdmin
    ? (
        await prisma.student.findMany({
          where: { extraClassRegistrations: { none: { extraClassId: extraClass.id } } },
          include: { class: true },
          orderBy: { name: "asc" },
        })
      ).map((s) => ({
        id: s.id,
        name: s.name,
        surname: s.surname,
        className: s.class.name,
      }))
    : [];

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
      <Link
        href="/list/extra-classes"
        className="text-sm text-gray-500 hover:text-gray-800 self-start"
      >
        ← Back to extra classes
      </Link>

      <div className="card p-6">
        <h1 className="text-xl font-semibold">{extraClass.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {extraClass.subject.name} · {extraClass.teacher.name}{" "}
          {extraClass.teacher.surname} · {dayLabel(extraClass.day)}{" "}
          {extraClass.startTime}–{extraClass.endTime}
        </p>
        {extraClass.description && (
          <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">
            {extraClass.description}
          </p>
        )}
        <p className={`mt-4 text-sm font-medium ${full ? "text-red-600" : "text-gray-700"}`}>
          {taken} of {extraClass.capacity} seats taken{full ? " (full)" : ""}
        </p>
      </div>

      <div className="card p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Registered students</h2>
        {isAdmin && (
          <ExtraClassAddStudent
            extraClassId={extraClass.id}
            students={addable}
            full={full}
          />
        )}
        {taken === 0 ? (
          <p className="text-sm text-gray-400">No one has registered yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-200">
                <th className="py-3 pl-4 font-semibold">Student</th>
                <th className="font-semibold">Class</th>
                <th className="hidden md:table-cell font-semibold">Registered</th>
                {isAdmin && <th className="font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {extraClass.registrations.map((r) => (
                <tr key={r.id} className="border-b border-gray-200 even:bg-slate-50">
                  <td className="p-4">
                    <Link
                      href={`/list/students/${r.student.id}`}
                      className="font-medium hover:underline"
                    >
                      {r.student.name} {r.student.surname}
                    </Link>
                  </td>
                  <td>{r.student.class.name}</td>
                  <td className="hidden md:table-cell text-gray-500">
                    {new Intl.DateTimeFormat("en-US").format(r.createdAt)}
                  </td>
                  {isAdmin && (
                    <td>
                      <ExtraClassRegisterButton
                        extraClassId={extraClass.id}
                        studentId={r.student.id}
                        registered
                        full={full}
                        label="Remove"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExtraClassPage;
