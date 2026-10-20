"use client";

import { UserRound } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { SelectOption } from "@/components/ui/form/FormSelect";
import type { TeacherFormValues } from "@/lib/formValidationSchemas";

import TeacherForm from "./TeacherForm";

interface TeacherDrawerProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  subjectOptions: SelectOption[];

  mode: "create" | "edit";

  initialData?: TeacherFormValues;
}

export default function TeacherDrawer({
  open,
  onOpenChange,
  subjectOptions,
  mode,
  initialData,
}: TeacherDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() =>
        onOpenChange(false)
      }
      title={
        mode === "create"
          ? "Create Teacher"
          : "Edit Teacher"
      }
      description={
        mode === "create"
          ? "Create a new teacher account."
          : "Update teacher information and assignments."
      }
      width="md"
      icon={
        <UserRound className="h-6 w-6" />
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
            form="teacher-form"
          >
            {mode === "create"
              ? "Create Teacher"
              : "Save Changes"}
          </Button>
        </>
      }
    >
      <TeacherForm
        mode={mode}
        subjectOptions={subjectOptions}
        initialData={initialData}
        onSuccess={() =>
          onOpenChange(false)
        }
      />
    </Drawer>
  );
}