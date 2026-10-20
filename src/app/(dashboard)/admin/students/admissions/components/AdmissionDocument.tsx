import Image from "next/image";
import { format } from "date-fns";

interface Props {
  student: any;
}

export default function AdmissionDocument({ student }: Props) {
  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] bg-white shadow-lg">
      {/* Header */}

      <div className="border-b-4 border-emerald-600 px-10 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/TSLogo.png"
              alt="School Logo"
              width={70}
              height={70}
            />

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                TRUE SUNSHINE PRESCHOOL
              </h1>

              <p className="text-sm text-slate-600">
                Student Admission Form
              </p>

              <p className="text-xs text-slate-500">
                Academic Year : {student.academicYear.label}
              </p>
            </div>
          </div>

          <div className="h-28 w-24 overflow-hidden rounded border">
            {student.img ? (
              <Image
                src={student.img}
                alt={student.name}
                width={96}
                height={112}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Photo
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admission Details */}

      <div className="grid grid-cols-4 gap-4 border-b bg-slate-50 px-10 py-5 text-sm">
        <Info
          label="Admission No"
          value={student.admissionNo}
        />

        <Info
          label="Roll No"
          value={student.rollNo}
        />

        <Info
          label="Admission Date"
          value={format(student.admissionDate, "dd MMM yyyy")}
        />

        <Info
          label="Status"
          value={student.status}
        />
      </div>

      {/* Student */}

      <SectionTitle title="Student Information" />

      <div className="grid grid-cols-2 gap-x-12 gap-y-4 px-10 py-6">
        <Info
          label="Full Name"
          value={`${student.name} ${student.surname}`}
        />

        <Info
          label="Gender"
          value={student.sex}
        />

        <Info
          label="Blood Group"
          value={student.bloodType}
        />

        <Info
          label="Date of Birth"
          value={
            student.birthday
              ? format(student.birthday, "dd MMM yyyy")
              : "-"
          }
        />

        <Info
          label="Phone"
          value={student.phone ?? "-"}
        />

        <Info
          label="Email"
          value={student.email ?? "-"}
        />

        <div className="col-span-2">
          <Info
            label="Address"
            value={student.address}
          />
        </div>
      </div>

      {/* Parent */}

      <SectionTitle title="Parent Information" />

      <div className="grid grid-cols-2 gap-x-12 gap-y-4 px-10 py-6">
        <Info
          label="Parent Name"
          value={`${student.parent.name} ${student.parent.surname}`}
        />

        <Info
          label="Phone"
          value={student.parent.phone}
        />

        <Info
          label="Email"
          value={student.parent.email ?? "-"}
        />

        <div className="col-span-2">
          <Info
            label="Address"
            value={student.parent.address}
          />
        </div>
      </div>

      {/* Academic */}

      <SectionTitle title="Academic Information" />

      <div className="grid grid-cols-2 gap-x-12 gap-y-4 px-10 py-6">
        <Info
          label="Class"
          value={student.class.name}
        />

        <Info
          label="Academic Year"
          value={student.academicYear.label}
        />
      </div>

      {/* Documents */}

      <SectionTitle title="Submitted Documents" />

      <div className="px-10 py-6">
        <div className="grid grid-cols-2 gap-3">
          {student.studentDocuments.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded border bg-slate-50 p-3"
            >
              <div className="text-green-600">✓</div>

              <div className="text-sm">
                {doc.documentType.replaceAll("_", " ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}

      <div className="mt-20 grid grid-cols-2 px-10 pb-10">
        <div>
          <div className="mx-auto w-48 border-t" />

          <p className="mt-2 text-center text-sm font-medium">
            Parent Signature
          </p>
        </div>

        <div>
          <div className="mx-auto w-48 border-t" />

          <p className="mt-2 text-center text-sm font-medium">
            Authorized Signatory
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="bg-emerald-600 px-10 py-2 text-sm font-semibold text-white">
      {title}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-base font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}