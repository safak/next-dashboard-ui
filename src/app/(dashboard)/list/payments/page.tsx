"use server";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TableSearch from "@/components/TableSearch";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import { getUserSessionInfo } from "@/lib/session";
import { Class, Prisma, Student } from "@prisma/client";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentsTable from "@/components/PaymentsTable";
import { NextResponse } from "next/server";

const PaymentsDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedParams = await searchParams;
  const { page, studentId, search } = resolvedParams;

  // 🔒 Auth
  const session = await getUserSessionInfo();
  if (!session || session.role !== "admin") {
    return notFound();
  }

  // ✅ Filtrage dynamique
 const where: Prisma.PaymentWhereInput = {};
const filters: Prisma.PaymentWhereInput[] = [];

if (studentId) {
  filters.push({ studentId });
}

if (search) {
  filters.push({
    OR: [
      {
        student: {
          name: {
            contains: search,
           // mode: "insensitive",
          },
        },
      },
      {
        student: {
          surname: {
            contains: search,
           // mode: "insensitive",
          },
        },
      },
    ],
  });
}

if (filters.length > 0) {
  where.AND = filters;
}


  // ✅ Requête avec filtre
 const data = await prisma.payment.findMany({
  where,
  include: {
    student: true,
    fee: {
      include: {
        period: true,
      },
    },
  },
});
let student = null;
if (studentId && typeof studentId === "string") {
  student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
      email: true,
      phone: true,
      address: true,
      img: true,
      bloodType: true,
      birthday: true,
      sex: true,
      createAt: true,
      parentId: true,
      classId: true,
      gradeId: true,
      class: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          date: true,
          fee: {
            select: {
              id: true,
              label: true,
              amount: true,
              period: {
                select: {
                  id: true,
                  label: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
//console.log(student);


  const { role } = session;

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 space-y-3 p-3">
      <h1 className="hidden md:block text-lg font-semibold">Payments</h1>

      {/* Statistiques */}
      <div className="flex gap-4">
        {[
          { label: "All", count: 401 },
          { label: "Succeeded", count: 267 },
          { label: "Refunded", count: 0 },
          { label: "Uncaptured", count: 0 },
        ].map((s) => (
          <div
            key={s.label}
            className="border rounded-lg px-6 py-4 w-36 text-center"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-xl font-semibold">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex flex-wrap gap-2 text-sm">
          {[
            "Date and time",
            "Amount",
            "Currency",
            "Status",
            "Payment method",
            "More filters",
          ].map((f) => (
            <Badge key={f} variant="outline">
              + {f}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline">Edit columns</Button>
              <Button>Export</Button>
            </div>
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                <Image
                  src="/uploads/filter.png"
                  width={14}
                  height={14}
                  alt=""
                />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kalasaYellow">
                <Image
                  src="/uploads/sors.png"
                  width={14}
                  height={14}
                  alt=""
                />
              </button>
              {role === "admin" && (
                <FormContainer table="payment" type="create" data={student} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto border rounded-lg">
        <PaymentsTable data={data} />
      </div>
    </div>
  );
};

export default PaymentsDashboard;
