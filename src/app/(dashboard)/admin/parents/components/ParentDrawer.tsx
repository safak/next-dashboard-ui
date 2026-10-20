"use client";

import { Users } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import ParentForm from "./ParentForm";
import { ParentFormValues } from "@/lib/formValidationSchemas";

interface ParentDrawerProps {
  open: boolean;
  loading?: boolean;

  initialValues?: ParentFormValues;

  onClose: () => void;
  onSubmit: (
    values: ParentFormValues,
  ) => void | Promise<void>;
}

export default function ParentDrawer({
  open,
  loading = false,
  initialValues,
  onClose,
  onSubmit,
}: ParentDrawerProps) {
  const mode = initialValues?.id
    ? "edit"
    : "create";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        mode === "create"
          ? "Create Parent"
          : "Edit Parent"
      }
      description={
        mode === "create"
          ? "Create a new parent account."
          : "Update parent information."
      }
      width="md"
      icon={<Users className="h-6 w-6" />}
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
            form="parent-form"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "create"
                ? "Create Parent"
                : "Save Changes"}
          </Button>
        </>
      }
    >
      <ParentForm
        mode={mode}
        initialData={initialValues}
        loading={loading}
        onSubmit={onSubmit}
      />
    </Drawer>
  );
}