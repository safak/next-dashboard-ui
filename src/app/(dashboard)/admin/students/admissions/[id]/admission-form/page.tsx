import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

import AdmissionDocument from "../../components/AdmissionDocument";
import PrintButton from "./PrintButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdmissionFormPage({ params }: Props) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      parent: true,
      class: true,
      academicYear: true,
      studentDocuments: true,
    },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar */}

      <div className="sticky top-0 z-20 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">
            Admission Form
          </h1>

          <PrintButton studentId={student.id} />
        </div>
      </div>

      {/* Document */}

      <div className="py-8">
        <AdmissionDocument student={student} />
      </div>
    </div>
  );
}