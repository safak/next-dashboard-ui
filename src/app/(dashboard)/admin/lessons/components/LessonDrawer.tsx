"use client";

import { BookOpen } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/ui/form/FormSelect";

import LessonForm from "./LessonForm";
import { LessonFormValues } from "@/lib/formValidationSchemas";

interface LessonDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  subjectOptions: SelectOption[];
  classOptions: SelectOption[];
  teacherOptions: SelectOption[];

  mode: "create" | "edit";

  initialData?: LessonFormValues;
}

export default function LessonDrawer({
  open,
  onOpenChange,
  subjectOptions,
  classOptions,
  teacherOptions,
  mode,
  initialData,
}: LessonDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={
        mode === "create"
          ? "Create Lesson"
          : "Edit Lesson"
      }
      description={
        mode === "create"
          ? "Create a new lesson for your school timetable."
          : "Update lesson information and schedule."
      }
      width="md"
      icon={<BookOpen className="h-6 w-6" />}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="lesson-form"
          >
            {mode === "create"
              ? "Create Lesson"
              : "Save Changes"}
          </Button>
        </>
      }
    >
      <LessonForm
        mode={mode}
        subjectOptions={subjectOptions}
        classOptions={classOptions}
        teacherOptions={teacherOptions}
        initialData={initialData}
        onSuccess={() => onOpenChange(false)}
      />
    </Drawer>
  );
}