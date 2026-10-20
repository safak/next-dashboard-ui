"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "react-toastify";

import { resultSchema, ResultFormValues } from "@/lib/formValidationSchemas";

import { createResult, updateResult } from "../actions";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

interface ClassOption {
  id: number;
  name: string;
}

interface StudentOption {
  id: string;
  name: string;
  surname: string;
  class: {
    id: number;
    name: string;
  } | null;
}

interface ExamOption {
  id: number;
  title: string;
  totalMarks: number;
  examDate: Date;
  classId: number;
  subjectId: number;
}

interface AssignmentOption {
  id: number;
  title: string;
  totalMarks: number;
  dueDate: Date;
  classId: number;
  subjectId: number;
}

interface ResultFormProps {
  mode: "create" | "edit";

  classes: ClassOption[];

  students: StudentOption[];

  exams: ExamOption[];

  assignments: AssignmentOption[];

  initialData?: ResultFormValues;

  initialClassId?: number;

  onSuccess?: () => void;
}

const emptyValues: ResultFormValues = {
  id: undefined,
  score: undefined as unknown as number,
  studentId: "",
  examId: undefined,
  assignmentId: undefined,
};

type ResultFormInput = z.input<typeof resultSchema>;
type ResultFormOutput = z.output<typeof resultSchema>;

type ResultFormState = ResultFormInput & {
  classId?: number;
};

export default function ResultForm({
  mode,
  classes,
  students,
  exams,
  assignments,
  initialData,
  initialClassId,
  onSuccess,
}: ResultFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResultFormState, unknown, ResultFormOutput>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      ...emptyValues,
      classId: initialClassId,
      ...(initialData ?? {}),
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        ...initialData,
        classId: initialClassId,
      });

      return;
    }

    if (mode === "create") {
      form.reset({
        ...emptyValues,
        classId: undefined,
      });
    }
  }, [mode, initialData, initialClassId, form]);

  const selectedClassId = form.watch("classId");
  const selectedExamId = form.watch("examId");
  const selectedAssignmentId = form.watch("assignmentId");
  const selectedStudentId = form.watch("studentId");

  const selectedExam = useMemo(
    () => exams.find((exam) => exam.id === selectedExamId),
    [exams, selectedExamId],
  );

  const selectedAssignment = useMemo(
    () =>
      assignments.find((assignment) => assignment.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  const selectedTotalMarks =
    selectedExam?.totalMarks ?? selectedAssignment?.totalMarks ?? 100;

  const selectedClassIdString = selectedClassId ? String(selectedClassId) : "";

  const filteredStudents = useMemo(() => {
    if (!selectedClassIdString) {
      return [];
    }

    return students.filter(
      (student) => String(student.class?.id ?? "") === selectedClassIdString,
    );
  }, [students, selectedClassIdString]);

  const filteredExams = useMemo(() => {
    if (!selectedClassIdString) {
      return [];
    }

    return exams.filter(
      (exam) => String(exam.classId) === selectedClassIdString,
    );
  }, [exams, selectedClassIdString]);

  const filteredAssignments = useMemo(() => {
    if (!selectedClassIdString) {
      return [];
    }

    return assignments.filter(
      (assignment) => String(assignment.classId) === selectedClassIdString,
    );
  }, [assignments, selectedClassIdString]);

  const classSelectOptions: SelectOption[] = useMemo(
    () =>
      (classes ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => ({
          value: String(item.id),
          label: item.name,
        })),
    [classes],
  );

  const studentSelectOptions: SelectOption[] = useMemo(
    () =>
      filteredStudents.map((student) => ({
        value: student.id,
        label: `${student.name} ${student.surname}`,
      })),
    [filteredStudents],
  );

  const examSelectOptions: SelectOption[] = useMemo(
    () =>
      filteredExams.map((exam) => ({
        value: String(exam.id),
        label: exam.title,
      })),
    [filteredExams],
  );

  const assignmentSelectOptions: SelectOption[] = useMemo(
    () =>
      filteredAssignments.map((assignment) => ({
        value: String(assignment.id),
        label: assignment.title,
      })),
    [filteredAssignments],
  );

  useEffect(() => {
    if (!selectedClassIdString) {
      return;
    }

    const studentStillBelongsToClass = filteredStudents.some(
      (student) => student.id === selectedStudentId,
    );

    if (selectedStudentId && !studentStillBelongsToClass) {
      form.setValue("studentId", "");
    }
  }, [selectedClassIdString, selectedStudentId, filteredStudents, form]);

  useEffect(() => {
    if (!selectedClassIdString) {
      return;
    }

    const examStillBelongsToClass = filteredExams.some(
      (exam) => String(exam.id) === String(selectedExamId),
    );

    if (selectedExamId && !examStillBelongsToClass) {
      form.setValue("examId", undefined);
    }
  }, [selectedClassIdString, selectedExamId, filteredExams, form]);

  useEffect(() => {
    if (!selectedClassIdString) {
      return;
    }

    const assignmentStillBelongsToClass = filteredAssignments.some(
      (assignment) => String(assignment.id) === String(selectedAssignmentId),
    );

    if (selectedAssignmentId && !assignmentStillBelongsToClass) {
      form.setValue("assignmentId", undefined);
    }
  }, [selectedClassIdString, selectedAssignmentId, filteredAssignments, form]);

  const handleClassChange = (value: number | undefined) => {
    form.setValue("classId", value, {
      shouldDirty: true,
      shouldValidate: false,
    });

    form.setValue("studentId", "");

    form.setValue("examId", undefined);

    form.setValue("assignmentId", undefined);

    form.clearErrors(["studentId", "examId", "assignmentId"]);
  };

  const handleExamChange = (value: number | undefined) => {
    form.setValue("examId", value);

    if (value) {
      form.setValue("assignmentId", undefined);
    }
  };

  const handleAssignmentChange = (value: number | undefined) => {
    form.setValue("assignmentId", value);

    if (value) {
      form.setValue("examId", undefined);
    }
  };

  const onSubmit = (values: ResultFormOutput) => {
    if (isPending) {
      return;
    }

    if (!selectedClassIdString) {
      toast.error("Please select a class.");
      return;
    }

    if (!values.studentId) {
      toast.error("Please select a student.");
      return;
    }

    if (!values.examId && !values.assignmentId) {
      toast.error("Please select an exam or assignment.");
      return;
    }

    if (values.examId && values.assignmentId) {
      toast.error("Select either an exam or an assignment.");
      return;
    }

    const selectedStudent = students.find(
      (student) => student.id === values.studentId,
    );

    if (
      !selectedStudent ||
      String(selectedStudent.class?.id ?? "") !== selectedClassIdString
    ) {
      toast.error(
        "The selected student does not belong to the selected class.",
      );
      return;
    }

    if (values.examId) {
      const selectedExam = exams.find((exam) => exam.id === values.examId);

      if (
        !selectedExam ||
        String(selectedExam.classId) !== selectedClassIdString
      ) {
        toast.error("The selected exam does not belong to the selected class.");
        return;
      }
    }

    if (values.assignmentId) {
      const selectedAssignment = assignments.find(
        (assignment) => assignment.id === values.assignmentId,
      );

      if (
        !selectedAssignment ||
        String(selectedAssignment.classId) !== selectedClassIdString
      ) {
        toast.error(
          "The selected assignment does not belong to the selected class.",
        );
        return;
      }
    }

    startTransition(async () => {
      try {
        const resultData: ResultFormValues = {
          id: values.id,
          score: values.score,
          studentId: values.studentId,
          examId: values.examId,
          assignmentId: values.assignmentId,
        };

        const result =
          mode === "create"
            ? await createResult(
                {
                  success: false,
                },
                resultData,
              )
            : await updateResult(
                {
                  success: false,
                },
                resultData,
              );

        if (!result.success) {
          toast.error(result.error ?? "Operation failed.");
          return;
        }

        toast.success(
          mode === "create"
            ? "Result created successfully."
            : "Result updated successfully.",
        );

        form.reset({
          ...emptyValues,
          classId: undefined,
        });

        onSuccess?.();
      } catch (error) {
        console.error("Result submit error:", error);

        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form
      id="result-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormSection
        title="Result Information"
        description="Select the class, assessment and student, then enter the score."
      >
        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          required
          options={classSelectOptions}
          emptyTitle="No Classes Available"
          emptyDescription="Please create a class first."
          disabled={isPending}
          valueAsNumber
        />

        <FormSelect
          control={form.control}
          name="studentId"
          label="Student"
          placeholder={
            selectedClassIdString ? "Select student" : "Select class first"
          }
          required
          options={studentSelectOptions}
          emptyTitle="No Students Available"
          emptyDescription={
            selectedClassIdString
              ? "No students are assigned to this class."
              : "Select a class first."
          }
          disabled={isPending || !selectedClassIdString}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Exam</label>

            {selectedExam && (
              <span className="rounded-md bg-[#EEF2FA] px-2 py-1 text-[11px] font-semibold text-[#4B517D]">
                Max Marks: {selectedExam.totalMarks}
              </span>
            )}
          </div>

          <FormSelect
            control={form.control}
            name="examId"
            label=""
            placeholder={
              selectedClassIdString ? "Select exam" : "Select class first"
            }
            options={examSelectOptions}
            emptyTitle="No Exams Available"
            emptyDescription={
              selectedClassIdString
                ? "No exams are available for this class."
                : "Select a class first."
            }
            disabled={
              isPending ||
              !selectedClassIdString ||
              Boolean(selectedAssignmentId)
            }
            valueAsNumber
          />
        </div>

        <FormSelect
          control={form.control}
          name="assignmentId"
          label="Assignment"
          placeholder={
            selectedClassIdString ? "Select assignment" : "Select class first"
          }
          options={assignmentSelectOptions}
          emptyTitle="No Assignments Available"
          emptyDescription={
            selectedClassIdString
              ? "No assignments are available for this class."
              : "Select a class first."
          }
          disabled={
            isPending || !selectedClassIdString || Boolean(selectedExamId)
          }
          valueAsNumber
        />

        <FormInput
          control={form.control}
          name="score"
          label="Score"
          type="number"
          min={0}
          max={selectedTotalMarks}
          placeholder={
            selectedTotalMarks
              ? `Enter score out of ${selectedTotalMarks}`
              : "Enter score"
          }
          required
          disabled={isPending}
          valueAsNumber
        />
      </FormSection>
    </form>
  );
}
