"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { createTeacher, updateTeacher } from "@/lib/actions";

import { teacherSchema, TeacherFormValues } from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormField from "@/components/ui/form/FormField";
import FormSection from "@/components/ui/form/FormSection";

import RadixSelect from "@/components/ui/RadixSelect";
import type { SelectOption } from "@/components/ui/form/FormSelect";

interface TeacherFormProps {
  mode: "create" | "edit";
  subjectOptions: SelectOption[];
  initialData?: TeacherFormValues;
  onSuccess?: () => void;
}

/* =========================================================
   BIRTHDAY DATE HEADER
========================================================= */

interface BirthdayDateHeaderProps {
  date: Date;

  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;

  decreaseMonth: () => void;
  increaseMonth: () => void;

  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

function BirthdayDateHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: BirthdayDateHeaderProps) {
  const currentYear = new Date().getFullYear();

  /* =======================================================
     MONTH OPTIONS
  ======================================================= */

  const months = [
    {
      value: "0",
      label: "January",
    },
    {
      value: "1",
      label: "February",
    },
    {
      value: "2",
      label: "March",
    },
    {
      value: "3",
      label: "April",
    },
    {
      value: "4",
      label: "May",
    },
    {
      value: "5",
      label: "June",
    },
    {
      value: "6",
      label: "July",
    },
    {
      value: "7",
      label: "August",
    },
    {
      value: "8",
      label: "September",
    },
    {
      value: "9",
      label: "October",
    },
    {
      value: "10",
      label: "November",
    },
    {
      value: "11",
      label: "December",
    },
  ];

  /* =======================================================
     YEAR OPTIONS
  ======================================================= */

  const years = Array.from(
    {
      length: 100,
    },
    (_, index) => {
      const year = currentYear - index;

      return {
        value: String(year),
        label: String(year),
      };
    },
  );

  /* =======================================================
     MONTH / YEAR DROPDOWN STATE

     Only one of these can be open at a time.
  ======================================================= */

  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5 px-2 py-2">
      {/* ==================================================
          PREVIOUS MONTH
      ================================================== */}

      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        aria-label="Previous month"
        className="
          flex
          h-9
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-500
          outline-none
          transition
          hover:bg-slate-100
          hover:text-slate-700
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* ==================================================
          MONTH
      ================================================== */}

      <div className="min-w-0 flex-1">
        <RadixSelect
          value={String(date.getMonth())}
          onChange={(value) => {
            changeMonth(Number(value));

            /*
             * Close Month after selection.
             */
            setMonthOpen(false);
          }}
          open={monthOpen}
          onOpenChange={(open) => {
            setMonthOpen(open);

            /*
             * Opening Month closes Year.
             */
            if (open) {
              setYearOpen(false);
            }
          }}
          options={months}
          className="
            h-9
            rounded-lg
            border-slate-200
            px-2
            text-xs
            font-semibold
            shadow-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      {/* ==================================================
          YEAR
      ================================================== */}

      <div className="min-w-0 flex-1">
        <RadixSelect
          value={String(date.getFullYear())}
          onChange={(value) => {
            changeYear(Number(value));

            /*
             * Close Year after selection.
             *
             * IMPORTANT:
             * We do NOT close the Birthday calendar here.
             * react-datepicker must remain open.
             */
            setYearOpen(false);
          }}
          open={yearOpen}
          onOpenChange={(open) => {
            setYearOpen(open);

            /*
             * Opening Year closes Month.
             */
            if (open) {
              setMonthOpen(false);
            }
          }}
          options={years}
          className="
            h-9
            rounded-lg
            border-slate-200
            px-2
            text-xs
            font-semibold
            shadow-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      {/* ==================================================
          NEXT MONTH
      ================================================== */}

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        aria-label="Next month"
        className="
          flex
          h-9
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-500
          outline-none
          transition
          hover:bg-slate-100
          hover:text-slate-700
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* =========================================================
   TEACHER FORM
========================================================= */

export default function TeacherForm({
  mode,
  subjectOptions,
  initialData,
  onSuccess,
}: TeacherFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  /* =======================================================
     TOP LEVEL DROPDOWN STATE

     Sex and Birthday can never be open together.
  ======================================================= */

  const [sexOpen, setSexOpen] = useState(false);
  const [birthdayOpen, setBirthdayOpen] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),

    defaultValues: initialData ?? {
      id: undefined,
      username: "",
      email: "",
      password: "",
      phone: "",
      name: "",
      surname: "",
      address: "",
      bloodType: "",
      sex: undefined,
      img: "",
      birthday: undefined,
      subjects: [],
      supervisedClasses: [],
    },
  });

  /* =========================================================
     RESET FORM WHEN EDIT / CREATE CHANGES
  ========================================================= */

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        username: initialData.username ?? "",
        email: initialData.email ?? "",
        password: "",
        phone: initialData.phone ?? "",
        name: initialData.name ?? "",
        surname: initialData.surname ?? "",
        address: initialData.address ?? "",
        bloodType: initialData.bloodType ?? "",
        sex: initialData.sex,
        img: initialData.img ?? "",
        birthday: initialData.birthday,
        subjects: initialData.subjects ?? [],
        supervisedClasses: initialData.supervisedClasses ?? [],
      });

      setSexOpen(false);
      setBirthdayOpen(false);

      return;
    }

    form.reset({
      id: undefined,
      username: "",
      email: "",
      password: "",
      phone: "",
      name: "",
      surname: "",
      address: "",
      bloodType: "",
      sex: undefined,
      img: "",
      birthday: undefined,
      subjects: [],
      supervisedClasses: [],
    });

    setSexOpen(false);
    setBirthdayOpen(false);
  }, [initialData, form]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = (values: TeacherFormValues) => {
    if (isPending) return;

    if (mode === "edit" && !initialData?.id) {
      toast.error("Teacher ID missing.");
      return;
    }

    startTransition(async () => {
      const payload: TeacherFormValues = {
        ...values,
        id: mode === "edit" ? initialData!.id : undefined,
      };

      const result =
        mode === "create"
          ? await createTeacher({ success: false }, payload)
          : await updateTeacher({ success: false }, payload);

      if (!result.success) {
        toast.error(result.error ?? "Failed to save teacher.");

        return;
      }

      toast.success(
        mode === "create"
          ? "Teacher created successfully."
          : "Teacher updated successfully.",
      );

      setSexOpen(false);
      setBirthdayOpen(false);

      form.reset();

      onSuccess?.();

      router.refresh();
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <form
      id="teacher-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2 pb-1"
    >
      {/* =====================================================
          ACCOUNT INFORMATION
      ===================================================== */}

      <FormSection
        title="Account Information"
        description={
          mode === "create"
            ? "Set up the teacher's login account."
            : "Update the teacher's login account."
        }
      >
        <FormInput
          control={form.control}
          name="username"
          label="Username"
          placeholder="e.g. lavanya"
          required
          disabled={isPending}
        />

        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder={
            mode === "edit"
              ? "Leave blank to keep current password"
              : "Enter password"
          }
          required={mode === "create"}
          disabled={isPending}
        />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="teacher@example.com"
          disabled={isPending}
        />
      </FormSection>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <FormSection
        title="Personal Information"
        description="Enter the teacher's personal details."
      >
        {/* ==================================================
            FIRST NAME
        ================================================== */}

        <FormInput
          control={form.control}
          name="name"
          label="First Name"
          placeholder="First name"
          required
          disabled={isPending}
        />

        {/* ==================================================
            LAST NAME
        ================================================== */}

        <FormInput
          control={form.control}
          name="surname"
          label="Last Name"
          placeholder="Last name"
          required
          disabled={isPending}
        />

        {/* ==================================================
            PHONE
        ================================================== */}

        <FormInput
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="10 digit phone number"
          required
          disabled={isPending}
        />

        {/* ==================================================
            SEX
        ================================================== */}

        <Controller
          control={form.control}
          name="sex"
          render={({ field, fieldState }) => (
            <FormField label="Sex" required error={fieldState.error?.message}>
              <RadixSelect
                value={field.value ?? ""}
                onChange={(value) => {
                  field.onChange(value);

                  /*
                   * Selection completed.
                   */
                  setSexOpen(false);
                }}
                open={sexOpen}
                onOpenChange={(open) => {
                  setSexOpen(open);

                  /*
                   * Opening Sex closes Birthday.
                   */
                  if (open) {
                    setBirthdayOpen(false);
                  }
                }}
                placeholder="Select sex"
                disabled={isPending}
                options={[
                  {
                    label: "Male",
                    value: "MALE",
                  },
                  {
                    label: "Female",
                    value: "FEMALE",
                  },
                ]}
              />
            </FormField>
          )}
        />

        {/* ==================================================
            BLOOD TYPE
        ================================================== */}

        <FormInput
          control={form.control}
          name="bloodType"
          label="Blood Type"
          placeholder="e.g. O+"
          required
          disabled={isPending}
        />

        {/* ==================================================
            BIRTHDAY
        ================================================== */}

        <Controller
          control={form.control}
          name="birthday"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarDays className="h-4 w-4 text-violet-500" />

                <span>Birthday</span>
              </label>

              <DatePicker
                selected={field.value instanceof Date ? field.value : null}
                onChange={(date: Date | null) => {
                  field.onChange(date ?? undefined);

                  /*
                   * Close the calendar only when an
                   * actual birthday is selected.
                   */
                  setBirthdayOpen(false);
                }}
                open={birthdayOpen}
                /* =================================================
                   OPEN BIRTHDAY
                ================================================= */

                onInputClick={() => {
                  setSexOpen(false);
                  setBirthdayOpen(true);
                }}
                onCalendarOpen={() => {
                  setSexOpen(false);
                  setBirthdayOpen(true);
                }}
                /* =================================================
                   CLOSE BIRTHDAY
                ================================================= */

                onCalendarClose={() => {
                  setBirthdayOpen(false);
                }}
                /*
                 * IMPORTANT FIX
                 *
                 * RadixSelect uses Select.Portal.
                 *
                 * Therefore clicking a Month/Year option
                 * technically looks like an outside click
                 * to react-datepicker.
                 *
                 * We ignore clicks inside Radix Select's
                 * listbox so the Birthday calendar remains
                 * open.
                 */
                onClickOutside={(event) => {
                  const target = event.target as HTMLElement | null;

                  if (target?.closest('[role="listbox"]')) {
                    return;
                  }

                  setBirthdayOpen(false);
                }}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select birthday"
                disabled={isPending}
                maxDate={new Date()}
                showPopperArrow={false}
                popperPlacement="bottom-start"
                popperClassName="event-datepicker-popper"
                calendarClassName="teacher-birthday-datepicker"
                className="event-datepicker"
                /* =================================================
                   CUSTOM MONTH / YEAR HEADER
                ================================================= */

                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <BirthdayDateHeader
                    date={date}
                    changeYear={changeYear}
                    changeMonth={changeMonth}
                    decreaseMonth={decreaseMonth}
                    increaseMonth={increaseMonth}
                    prevMonthButtonDisabled={prevMonthButtonDisabled}
                    nextMonthButtonDisabled={nextMonthButtonDisabled}
                  />
                )}
              />

              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* ==================================================
            ADDRESS
        ================================================== */}

        <div className="col-span-full">
          <FormInput
            control={form.control}
            name="address"
            label="Address"
            placeholder="Teacher address"
            required
            disabled={isPending}
          />
        </div>

        {/* ==================================================
            PROFILE IMAGE
        ================================================== */}

        <div className="col-span-full">
          <FormInput
            control={form.control}
            name="img"
            label="Profile Image URL"
            placeholder="https://..."
            disabled={isPending}
          />
        </div>
      </FormSection>

      {/* =====================================================
          SUBJECT ASSIGNMENTS
      ===================================================== */}

      <FormSection
        title="Subject Assignments"
        description="Select the subjects this teacher can teach."
      >
        <div className="col-span-full">
          <Controller
            control={form.control}
            name="subjects"
            render={({ field, fieldState }) => {
              const selected = field.value ?? [];

              return (
                <FormField
                  label="Subjects"
                  required
                  error={fieldState.error?.message}
                >
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    {subjectOptions.length === 0 ? (
                      <div className="px-3 py-3 text-sm text-slate-500">
                        No subjects available.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-px bg-slate-100">
                        {subjectOptions.map((subject) => {
                          const id = String(subject.value);

                          const checked = selected.includes(id);

                          return (
                            <label
                              key={id}
                              className={`flex cursor-pointer items-center gap-2.5 bg-white px-3 py-2 transition-colors ${
                                checked
                                  ? "bg-indigo-50/60"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={isPending}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    field.onChange(
                                      Array.from(new Set([...selected, id])),
                                    );
                                  } else {
                                    field.onChange(
                                      selected.filter((value) => value !== id),
                                    );
                                  }
                                }}
                                className="
                                  h-4
                                  w-4
                                  shrink-0
                                  rounded
                                  border-slate-300
                                  text-indigo-600
                                  focus:ring-indigo-500
                                "
                              />

                              <span className="truncate text-sm font-medium text-slate-700">
                                {subject.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    <div className="border-t border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">
                          {selected.length}
                        </span>{" "}
                        {selected.length === 1 ? "subject" : "subjects"}{" "}
                        selected
                      </p>
                    </div>
                  </div>
                </FormField>
              );
            }}
          />
        </div>
      </FormSection>

      {/* =====================================================
          INFORMATION TIP
      ===================================================== */}

      <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
        <p className="text-xs leading-5 text-slate-500">
          <span className="font-semibold text-indigo-600">Tip:</span> Add the
          teacher&apos;s account and personal information, then assign the subjects
          they can teach.
        </p>
      </div>
    </form>
  );
}
