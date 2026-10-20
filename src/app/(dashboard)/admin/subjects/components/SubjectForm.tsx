"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Search, UserRound, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createSubject, updateSubject } from "@/lib/actions";

import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormField from "@/components/ui/form/FormField";
import FormSection from "@/components/ui/form/FormSection";

import type { SelectOption } from "@/components/ui/form/FormSelect";

interface SubjectFormProps {
  mode: "create" | "edit";
  teacherOptions: SelectOption[];
  initialData?: SubjectSchema;
  onSuccess?: () => void;
}

export default function SubjectForm({
  mode,
  teacherOptions,
  initialData,
  onSuccess,
}: SubjectFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [teacherSearch, setTeacherSearch] = useState("");

  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? "",
      teachers: initialData?.teachers ?? [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name,
        teachers: initialData.teachers ?? [],
      });

      setTeacherSearch("");
      return;
    }

    if (mode === "create") {
      form.reset({
        id: undefined,
        name: "",
        teachers: [],
      });

      setTeacherSearch("");
    }
  }, [mode, initialData, form]);

  const onSubmit = (values: SubjectSchema) => {
    if (isPending) return;

    if (mode === "edit" && !initialData?.id) {
      toast.error("Subject ID missing.");
      return;
    }

    startTransition(async () => {
      const payload: SubjectSchema = {
        ...values,
        id: mode === "edit" ? initialData!.id : undefined,
      };

      const result =
        mode === "create"
          ? await createSubject({ success: false }, payload)
          : await updateSubject({ success: false }, payload);

      if (!result.success) {
        toast.error(result.error ?? "Operation failed.");
        return;
      }

      toast.success(
        mode === "create"
          ? "Subject created successfully."
          : "Subject updated successfully.",
      );

      form.reset({
        id: undefined,
        name: "",
        teachers: [],
      });

      onSuccess?.();
      router.refresh();
    });
  };

  return (
    <form
      id="subject-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormSection
        title="Subject Information"
        description="Enter the subject details."
      >
        <div className="col-span-full w-full space-y-5">
          {/* Subject Name */}

          <FormInput
            control={form.control}
            name="name"
            label="Subject Name"
            placeholder="e.g. Mathematics"
            required
            disabled={isPending}
          />

          {/* Teachers */}

          <Controller
            control={form.control}
            name="teachers"
            render={({ field, fieldState }) => {
              const selectedTeachers = field.value ?? [];

              const filteredTeachers = teacherOptions.filter((teacher) =>
                teacher.label
                  .toLowerCase()
                  .includes(teacherSearch.toLowerCase().trim()),
              );

              const selectedTeacherOptions = teacherOptions.filter((teacher) =>
                selectedTeachers.includes(String(teacher.value)),
              );

              const toggleTeacher = (teacherId: string) => {
                if (selectedTeachers.includes(teacherId)) {
                  field.onChange(
                    selectedTeachers.filter((id) => id !== teacherId),
                  );
                  return;
                }

                field.onChange([...selectedTeachers, teacherId]);
              };

              const getInitials = (label: string) =>
                label
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part.charAt(0))
                  .join("")
                  .toUpperCase();

              return (
                <FormField
                  label="Teachers"
                  required
                  description="Select one or more teachers who can teach this subject."
                  error={fieldState.error?.message}
                >
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 bg-slate-50/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                            <UserRound className="h-4 w-4 text-indigo-600" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              Assign Teachers
                            </p>

                            <p className="text-xs text-slate-500">
                              Choose teachers for this subject
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                          {selectedTeachers.length} selected
                        </div>
                      </div>

                      {selectedTeacherOptions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {selectedTeacherOptions.map((teacher) => {
                            const teacherId = String(teacher.value);

                            return (
                              <div
                                key={teacherId}
                                className="flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm"
                              >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-600">
                                  {getInitials(teacher.label)}
                                </span>

                                <span className="max-w-[140px] truncate">
                                  {teacher.label}
                                </span>

                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => toggleTeacher(teacherId)}
                                  className="ml-0.5 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                  aria-label={`Remove ${teacher.label}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="border-b border-slate-200 p-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={teacherSearch}
                          onChange={(event) =>
                            setTeacherSearch(event.target.value)
                          }
                          disabled={isPending}
                          placeholder="Search teachers..."
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />

                        {teacherSearch && (
                          <button
                            type="button"
                            onClick={() => setTeacherSearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Clear teacher search"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2">
                      {teacherOptions.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <UserRound className="mx-auto mb-2 h-5 w-5 text-slate-300" />

                          <p className="text-sm font-medium text-slate-700">
                            No teachers available
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Add teachers before assigning them to subjects.
                          </p>
                        </div>
                      ) : filteredTeachers.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Search className="mx-auto mb-2 h-5 w-5 text-slate-300" />

                          <p className="text-sm font-medium text-slate-600">
                            No teachers found
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Try a different teacher name.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredTeachers.map((teacher) => {
                            const teacherId = String(teacher.value);

                            const checked =
                              selectedTeachers.includes(teacherId);

                            return (
                              <button
                                key={teacherId}
                                type="button"
                                disabled={isPending}
                                onClick={() => toggleTeacher(teacherId)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                                  checked
                                    ? "bg-indigo-50 ring-1 ring-inset ring-indigo-100"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    checked
                                      ? "bg-indigo-100 text-indigo-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {getInitials(teacher.label)}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`truncate text-sm font-medium ${
                                      checked
                                        ? "text-indigo-700"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {teacher.label}
                                  </p>

                                  <p className="text-[11px] text-slate-400">
                                    Teacher
                                  </p>
                                </div>

                                <div
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                    checked
                                      ? "border-indigo-600 bg-indigo-600 text-white"
                                      : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {checked && <Check className="h-3.5 w-3.5" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {selectedTeachers.length > 0 && (
                      <div className="border-t border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">
                              {selectedTeachers.length}
                            </span>{" "}
                            {selectedTeachers.length === 1
                              ? "teacher"
                              : "teachers"}{" "}
                            assigned
                          </p>

                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => field.onChange([])}
                            className="text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </FormField>
              );
            }}
          />
        </div>
      </FormSection>
    </form>
  );
}
