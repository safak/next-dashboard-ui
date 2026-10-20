"use client";

import Drawer from "@/components/ui/Drawer";
import type { Student } from "@/types/student";

interface StudentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  student: Student | null;
}

export default function StudentDrawer({
  open,
  onOpenChange,
  student,
}: StudentDrawerProps) {
  if (!student) return null;

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Student Details"
      description="View and manage student information."
      width="xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <section>
          <h3 className="mb-3 text-lg font-semibold">Basic Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Admission No" value={student.admissionNo} />

            <Info label="Roll No" value={student.rollNo} />

            <Info label="Full Name" value={student.fullName} />

            <Info label="Gender" value={student.gender} />

            <Info label="Phone" value={student.phone} />

            <Info label="Email" value={student.email} />
          </div>
        </section>

        {/* Academic */}
        <section>
          <h3 className="mb-3 text-lg font-semibold">Academic Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Class" value={student.className} />

            <Info label="Academic Year" value={student.academicYear} />

            <Info label="Status" value={student.status} />
          </div>
        </section>

        {/* Parent */}
        <section>
          <h3 className="mb-3 text-lg font-semibold">Parent Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Parent" value={student.parentName} />

            <Info label="Parent Phone" value={student.parentPhone} />
          </div>
        </section>
      </div>
    </Drawer>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}
