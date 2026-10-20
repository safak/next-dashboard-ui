"use client";

import { GraduationCap } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import AdmissionForm, { FeeStructureOption } from "./AdmissionForm";

import { StudentFormValues } from "@/lib/formValidationSchemas";
import { SelectOption } from "@/components/ui/form/FormSelect";

interface AdmissionDrawerProps {
  open: boolean;
  loading?: boolean;

  initialValues?: StudentFormValues;

  classOptions: SelectOption[];
  parentOptions: SelectOption[];
  feeStructureOptions: FeeStructureOption[];

  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdmissionDrawer({
  open,
  loading = false,
  initialValues,
  classOptions,
  parentOptions,
  feeStructureOptions,
  onClose,
  onSuccess,
}: AdmissionDrawerProps) {
  const mode = initialValues?.id ? "edit" : "create";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Admission" : "Edit Admission"}
      description={
        mode === "create"
          ? "Create a new student admission record."
          : "Update the student admission record."
      }
      width="md"
      icon={<GraduationCap className="h-6 w-6" />}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="admission-form"
            disabled={loading}
            className="bg-slate-900 font-semibold hover:bg-slate-800"
          >
            {loading
              ? "Please wait..."
              : mode === "create"
                ? "Create Admission"
                : "Save Changes"}
          </Button>
        </>
      }
    >
      <AdmissionForm
        mode={mode}
        initialData={initialValues}
        classOptions={classOptions}
        parentOptions={parentOptions}
        feeStructureOptions={feeStructureOptions}
        loading={loading}
        onSuccess={onSuccess}
      />
    </Drawer>
  );
}
