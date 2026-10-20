"use client";

import { BookOpen } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { SelectOption } from "@/components/ui/form/FormSelect";
import type { SubjectSchema } from "@/lib/formValidationSchemas";

import SubjectForm from "./SubjectForm";

interface SubjectDrawerProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  teacherOptions: SelectOption[];

  mode: "create" | "edit";

  initialData?: SubjectSchema;
}

export default function SubjectDrawer({
  open,
  onOpenChange,
  teacherOptions,
  mode,
  initialData,
}: SubjectDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={
        mode === "create"
          ? "Create Subject"
          : "Edit Subject"
      }
      description={
        mode === "create"
          ? "Create a new subject and assign teachers."
          : "Update subject information and teacher assignments."
      }
      width="md"
      icon={
        <BookOpen className="h-6 w-6" />
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="subject-form"
          >
            {mode === "create"
              ? "Create Subject"
              : "Save Changes"}
          </Button>
        </>
      }
    >
      <SubjectForm
        mode={mode}
        teacherOptions={teacherOptions}
        initialData={initialData}
        onSuccess={() =>
          onOpenChange(false)
        }
      />
    </Drawer>
  );
}