"use client";

import Image from "next/image";
import { Mail, Phone } from "lucide-react";

import { Student } from "@/types/student";
import StatusBadge from "@/components/ui/StatusBadge";
import StudentRowActions from "./StudentRowActions";

interface StudentRowProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onArchive: (student: Student) => void;
}

export default function StudentRow({
  student,
  onView,
  onEdit,
  onArchive,
}: StudentRowProps) {
  return (
    <tr className="hover:bg-muted/40">
      {/* Student */}
      <td className="min-w-[280px]">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border">
            <Image
              src={student.image || "/noAvatar.png"}
              alt={student.fullName}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1">
            <p className="font-semibold">{student.fullName}</p>

            <p className="text-xs text-muted-foreground">
              Admission No : {student.admissionNo}
            </p>

            <p className="text-xs text-muted-foreground">
              Roll No : {student.rollNo}
            </p>
          </div>
        </div>
      </td>

      {/* Academic */}
      <td>
        <div className="space-y-1">
          <p className="font-medium">{student.className}</p>

          <p className="text-xs text-muted-foreground">
            {student.academicYear}
          </p>
        </div>
      </td>

      {/* Parent */}
      <td>
        <div className="space-y-1">
          <p className="font-medium">{student.parentName}</p>

          <p className="text-xs text-muted-foreground">Parent</p>
        </div>
      </td>

      {/* Contact */}
      <td>
        <div className="space-y-2">
          {student.parentPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{student.parentPhone}</span>
            </div>
          )}

          {student.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{student.email}</span>
            </div>
          )}
        </div>
      </td>

      {/* Status */}
      <td>
        <StatusBadge
          variant={student.status === "ACTIVE" ? "success" : "secondary"}
        >
          {student.status}
        </StatusBadge>
      </td>

      {/* Actions */}
      <td className="text-right">
        <StudentRowActions
          student={student}
          onView={onView}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      </td>
    </tr>
  );
}
