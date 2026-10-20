"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import type { Student } from "@/types/student";

import PersonalSection from "./sections/PersonalSection";
import AcademicSection from "./sections/AcademicSection";
import ParentSection from "./sections/ParentSection";
import DocumentsSection from "./sections/DocumentsSection";

interface StudentEditFormProps {
  student: Student;
  onClose: () => void;
  onSuccess?: () => void;
}

type Tab = "personal" | "academic" | "parent" | "documents";

const tabs: { id: Tab; label: string }[] = [
  {
    id: "personal",
    label: "Personal",
  },
  {
    id: "academic",
    label: "Academic",
  },
  {
    id: "parent",
    label: "Parent",
  },
  {
    id: "documents",
    label: "Documents",
  },
];

export default function StudentEditForm({
  student,
  onClose,
  onSuccess,
}: StudentEditFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [saving, setSaving] = useState(false);

  const form = useForm<Student>({
    defaultValues: student,
    mode: "onChange",
  });

  const { control, reset, handleSubmit } = form;

  useEffect(() => {
    reset(student);
    setActiveTab("personal");
  }, [student, reset]);

  async function onSubmit(data: Student) {
    try {
      setSaving(true);

      const response = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to update student.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update student:", error);

      alert(
        error instanceof Error ? error.message : "Failed to update student.",
      );
    } finally {
      setSaving(false);
    }
  }

  const showFormFooter = activeTab !== "documents";

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full min-h-0 flex-col bg-slate-50"
      >
        {/* ==================================================
            Tabs
        ================================================== */}

        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex h-12 px-5">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative h-12 px-4 text-sm font-medium transition ${
                    active
                      ? "text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}

                  {active && (
                    <span
                      className="
                        absolute
                        inset-x-2
                        bottom-0
                        h-0.5
                        rounded-full
                        bg-indigo-600
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            Content
        ================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-5 py-4">
            {activeTab === "personal" && <PersonalSection control={control} />}

            {activeTab === "academic" && <AcademicSection control={control} />}

            {activeTab === "parent" && <ParentSection control={control} />}

            {activeTab === "documents" && (
              <DocumentsSection studentId={student.id} />
            )}
          </div>
        </div>

        {/* ==================================================
            Footer
        ================================================== */}

        {showFormFooter && (
          <div
            className="
              flex
              shrink-0
              items-center
              justify-end
              gap-2
              border-t
              border-slate-200
              bg-white
              px-5
              py-3
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                rounded-lg
                bg-indigo-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
