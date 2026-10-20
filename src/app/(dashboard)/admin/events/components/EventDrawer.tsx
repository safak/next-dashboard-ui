"use client";

import { CalendarDays } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import EventForm from "./EventForm";

import type { ClassOption } from "../types";
import type { EventFormValues } from "../schema";

interface EventDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classes: ClassOption[];

  mode: "create" | "edit";

  initialData?: EventFormValues;
}

export default function EventDrawer({
  open,
  onOpenChange,
  classes,
  mode,
  initialData,
}: EventDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={mode === "create" ? "Create Event" : "Edit Event"}
      description={
        mode === "create"
          ? "Create a new event for your school calendar."
          : "Update event information and schedule."
      }
      width="md"
      icon={<CalendarDays className="h-6 w-6" />}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button type="submit" form="event-form">
            {mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
        </>
      }
    >
      <EventForm
        mode={mode}
        classes={classes}
        initialData={initialData}
        onSuccess={() => onOpenChange(false)}
      />
    </Drawer>
  );
}
