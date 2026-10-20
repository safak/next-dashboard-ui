"use client";

import { CalendarDays } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import HolidayForm from "./HolidayForm";
import type { HolidayFormValues } from "@/lib/formValidationSchemas";

interface HolidayDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "create" | "edit";

  initialData?: HolidayFormValues;
}

export default function HolidayDrawer({
  open,
  onOpenChange,
  mode,
  initialData,
}: HolidayDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={mode === "create" ? "Create Holiday" : "Edit Holiday"}
      description={
        mode === "create"
          ? "Create a new school holiday."
          : "Update holiday information."
      }
      width="sm"
      icon={<CalendarDays className="h-6 w-6" />}
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
            form="holiday-form"
          >
            {mode === "create" ? "Create Holiday" : "Save Changes"}
          </Button>
        </>
      }
    >
      <HolidayForm
        mode={mode}
        initialData={initialData}
        onSuccess={() => onOpenChange(false)}
      />
    </Drawer>
  );
}