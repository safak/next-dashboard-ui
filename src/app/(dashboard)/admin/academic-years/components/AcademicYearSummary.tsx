"use client";

import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Users,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface AcademicYear {
  id: number;
  label: string;
  isActive: boolean;

  _count: {
    classes: number;
    students: number;
  };
}

interface Props {
  academicYears: AcademicYear[];
}

export default function AcademicYearSummary({
  academicYears,
}: Props) {
  const totalYears = academicYears.length;

  const activeYear = academicYears.find(
    (year) => year.isActive,
  );

  const totalClasses = academicYears.reduce(
    (sum, year) => sum + year._count.classes,
    0,
  );

  const totalStudents = academicYears.reduce(
    (sum, year) => sum + year._count.students,
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Academic Years */}
      <SummaryCard
        title="Academic Years"
        value={totalYears}
        icon={CalendarDays}
        color="blue"
        compact
      />

      {/* Active Academic Year */}
      <SummaryCard
        title="Active Academic Year"
        value={activeYear?.label ?? "-"}
        icon={CheckCircle2}
        color="green"
        compact
      />

      {/* Classes */}
      <SummaryCard
        title="Classes"
        value={totalClasses}
        icon={GraduationCap}
        color="yellow"
        compact
      />

      {/* Students */}
      <SummaryCard
        title="Students"
        value={totalStudents}
        icon={Users}
        color="purple"
        compact
      />
    </div>
  );
}