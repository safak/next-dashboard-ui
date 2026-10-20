"use client";

import Drawer from "@/components/ui/Drawer";
import { Pencil } from "lucide-react";

import type { Student } from "@/types/student";
import StudentEditForm from "./StudentEditForm";

interface StudentEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess?: () => void;
}

export default function StudentEditSheet({
  open,
  onOpenChange,
  student,
  onSuccess,
}: StudentEditSheetProps) {
  if (!student) return null;

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="md"
      icon={<Pencil className="h-5 w-5" />}
      title="Edit Student"
      description="Update the student's personal, academic and parent information."
      flush
    >
      <StudentEditForm
        student={student}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </Drawer>
  );
}