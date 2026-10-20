"use client";

import { School } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import ClassForm from "./ClassForm";
import { SelectOption } from "@/components/ui/form/FormSelect";
import { ClassSchema } from "@/lib/formValidationSchemas";

interface ClassDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  teacherOptions: SelectOption[];

  mode: "create" | "edit";

  initialData?: ClassSchema;
}

export default function ClassDrawer({
  open,
  onOpenChange,
  teacherOptions,
  mode,
  initialData,
}: ClassDrawerProps) {
  const isCreate = mode === "create";

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={mode === "create" ? "Create Class" : "Edit Class"}
      description={
        mode === "create"
          ? "Create a new academic class."
          : "Update class information."
      }
      width="md"
      icon={<School className="h-6 w-6" />}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button type="submit" form="class-form">
            {mode === "create" ? "Create Class" : "Save Changes"}
          </Button>
        </>
      }
    >
      <ClassForm
        mode={mode}
        teacherOptions={teacherOptions}
        initialData={initialData}
        onSuccess={() => onOpenChange(false)}
      />
    </Drawer>
  );
}
