"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CalendarDays, Clock3 } from "lucide-react";

import { createEvent, updateEvent } from "../actions";
import {
  eventSchema,
  type EventFormInput,
  type EventFormValues,
} from "../schema";

import FormInput from "@/components/ui/form/FormInput";
import FormSection from "@/components/ui/form/FormSection";
import FormSelect from "@/components/ui/form/FormSelect";

import type { ClassOption } from "../types";

interface EventFormProps {
  mode: "create" | "edit";

  classes: ClassOption[];

  initialData?: EventFormValues;

  onSuccess?: () => void;
}

export default function EventForm({
  mode,
  classes,
  initialData,
  onSuccess,
}: EventFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventSchema),

    defaultValues: initialData ?? {
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      classId: null,
      category: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
      return;
    }

    form.reset({
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      classId: null,
      category: "",
    });
  }, [initialData, mode, form]);

  const onSubmit = (values: EventFormValues) => {
    if (isPending) return;

    if (values.endTime.getTime() <= values.startTime.getTime()) {
      toast.error("End time must be after start time.");
      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createEvent({ success: false }, values)
          : await updateEvent({ success: false }, values);

      if (!result.success) {
        toast.error(result.error ?? "Operation failed.");
        return;
      }

      toast.success(
        mode === "create"
          ? "Event created successfully."
          : "Event updated successfully.",
      );

      form.reset();

      onSuccess?.();

      router.refresh();
    });
  };

  const classOptions = classes.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  return (
    <form
      id="event-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* EVENT INFORMATION */}

      <FormSection
        title="Event Information"
        description="Enter the event details."
      >
        <FormInput
          control={form.control}
          name="title"
          label="Event Title"
          placeholder="e.g. Annual Sports Day"
          required
          disabled={isPending}
        />

        <FormInput
          control={form.control}
          name="description"
          label="Description"
          placeholder="Enter event description"
          required
          disabled={isPending}
        />

        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          options={classOptions}
          valueAsNumber
          emptyTitle="No Classes Available"
          emptyDescription="Please create a class before creating an event."
          disabled={isPending}
        />

        <FormInput
          control={form.control}
          name="category"
          label="Category"
          placeholder="e.g. Academic, Cultural, Sports"
          disabled={isPending}
        />
      </FormSection>

      {/* EVENT SCHEDULE */}

      <FormSection
        title="Event Schedule"
        description="Set the event start and end time."
      >
        <div className="space-y-5">
          {/* START TIME */}

          <Controller
            control={form.control}
            name="startTime"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CalendarDays className="h-4 w-4 text-violet-500" />

                  <span>
                    Start Time
                    <span className="ml-1 text-red-500">*</span>
                  </span>
                </label>

                <DatePicker
                  selected={field.value instanceof Date ? field.value : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      field.onChange(date);
                    }
                  }}
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="h:mm aa"
                  dateFormat="dd-MM-yyyy h:mm aa"
                  placeholderText="Select start date and time"
                  disabled={isPending}
                  popperPlacement="bottom-start"
                  popperClassName="event-datepicker-popper"
                  calendarClassName="event-datepicker-calendar"
                  className="event-datepicker"
                />

                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* END TIME */}

          <Controller
            control={form.control}
            name="endTime"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock3 className="h-4 w-4 text-violet-500" />

                  <span>
                    End Time
                    <span className="ml-1 text-red-500">*</span>
                  </span>
                </label>

                <DatePicker
                  selected={field.value instanceof Date ? field.value : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      field.onChange(date);
                    }
                  }}
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="h:mm aa"
                  dateFormat="dd-MM-yyyy h:mm aa"
                  placeholderText="Select end date and time"
                  disabled={isPending}
                  popperPlacement="bottom-start"
                  popperClassName="event-datepicker-popper"
                  calendarClassName="event-datepicker-calendar"
                  className="event-datepicker"
                />

                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </FormSection>
    </form>
  );
}
