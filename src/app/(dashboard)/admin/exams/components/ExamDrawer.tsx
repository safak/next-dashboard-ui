"use client";

import { ClipboardList } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import ExamForm from "./ExamForm";

import type { SelectOption } from "@/components/ui/form/FormSelect";
import type { ExamSchema } from "@/lib/formValidationSchemas";

interface ExamDrawerProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  mode: "create" | "edit";

  classOptions: SelectOption[];

  subjectOptions: SelectOption[];

  teacherOptions: SelectOption[];

  initialData?: ExamSchema;

  onSuccess?: () => void;
}

export default function ExamDrawer({
  open,
  onOpenChange,
  mode,
  classOptions,
  subjectOptions,
  teacherOptions,
  initialData,
  onSuccess,
}: ExamDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={
        mode === "create"
          ? "Create Exam"
          : "Edit Exam"
      }
      description={
        mode === "create"
          ? "Create a new academic exam."
          : "Update exam information."
      }
      width="md"
      icon={
        <ClipboardList className="h-6 w-6" />
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="exam-form"
          >
            {mode === "create"
              ? "Create Exam"
              : "Save Changes"}
          </Button>
        </>
      }
    >
      <ExamForm
        mode={mode}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        teacherOptions={teacherOptions}
        initialData={initialData}
        onSuccess={() => {
          /*
           * First close the drawer.
           */
          onOpenChange(false);

          /*
           * Then notify dashboard that
           * the exam was successfully saved.
           */
          onSuccess?.();
        }}
      />
    </Drawer>
  );
}