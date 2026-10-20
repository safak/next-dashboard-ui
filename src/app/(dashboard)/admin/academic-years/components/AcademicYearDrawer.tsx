"use client";

import { useRef } from "react";
import { CalendarDays } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import {
  AcademicYearFormInput,
} from "@/lib/formValidationSchemas";

import AcademicYearForm from "./AcademicYearForm";

interface AcademicYear {
  id: number;
  label: string;
}

interface Props {
  open: boolean;

  loading?: boolean;

  initialValues?: AcademicYearFormInput;

  academicYears: AcademicYear[];

  onClose: () => void;

  onSubmit: (
    values: AcademicYearFormInput,
  ) => Promise<void>;
}

export default function AcademicYearDrawer({
  open,
  loading = false,
  initialValues,
  academicYears,
  onClose,
  onSubmit,
}: Props) {
  const submitForm = useRef<(() => void) | null>(null);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="md"
      icon={<CalendarDays className="h-5 w-5" />}
      title={
        initialValues
          ? "Edit Academic Year"
          : "Create Academic Year"
      }
      description={
        initialValues
          ? "Update academic year information."
          : "Create a new academic session."
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={() => submitForm.current?.()}
          >
            {loading
              ? "Saving..."
              : initialValues
                ? "Update Academic Year"
                : "Create Academic Year"}
          </Button>
        </>
      }
    >
      <AcademicYearForm
        initialValues={initialValues}
        academicYears={academicYears}
        loading={loading}
        onSubmit={onSubmit}
        onFormReady={(submit) => {
          submitForm.current = submit;
        }}
      />
    </Drawer>
  );
}