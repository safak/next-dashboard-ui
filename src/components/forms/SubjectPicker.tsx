"use client";

import type { DeliveryMode, LessonFormat } from "@prisma/client";
import {
  deliveryLabels,
  deliveryStyles,
  formatLabels,
  formatsFor,
} from "@/lib/subjectDelivery";

export type SubjectOption = { id: number; name: string; delivery: DeliveryMode };
export type SubjectChoice = { subjectId: number; format?: LessonFormat };

// Tick subjects, then pick how each one is taught. Only the lesson types
// the subject's delivery mode allows are offered.
const SubjectPicker = ({
  subjects,
  value,
  onChange,
  showErrors,
}: {
  subjects: SubjectOption[];
  value: SubjectChoice[];
  onChange: (value: SubjectChoice[]) => void;
  showErrors: boolean;
}) => {
  const chosen = new Map(value.map((c) => [c.subjectId, c]));

  const toggle = (s: SubjectOption) => {
    if (chosen.has(s.id)) {
      onChange(value.filter((c) => c.subjectId !== s.id));
      return;
    }
    const formats = formatsFor(s.delivery);
    // A subject with only one possible lesson type needs no second click
    onChange([
      ...value,
      { subjectId: s.id, format: formats.length === 1 ? formats[0] : undefined },
    ]);
  };

  const setFormat = (subjectId: number, format: LessonFormat) =>
    onChange(value.map((c) => (c.subjectId === subjectId ? { ...c, format } : c)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {subjects.map((s) => {
        const choice = chosen.get(s.id);
        const missingFormat = showErrors && choice && !choice.format;

        return (
          <div
            key={s.id}
            className={`rounded-lg p-3 flex flex-col gap-2 transition ${
              choice
                ? "ring-2 ring-indigo-400 bg-indigo-50/60"
                : "ring-1 ring-gray-200"
            }`}
          >
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 accent-indigo-500"
                checked={!!choice}
                onChange={() => toggle(s)}
              />
              <span className="flex-1 font-medium text-gray-800">{s.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${deliveryStyles[s.delivery]}`}
              >
                {deliveryLabels[s.delivery]}
              </span>
            </label>

            {choice && (
              <div role="radiogroup" aria-label={`Lesson type for ${s.name}`} className="flex flex-wrap gap-1.5 pl-6">
                {formatsFor(s.delivery).map((f) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={choice.format === f}
                    key={f}
                    onClick={() => setFormat(s.id, f)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      choice.format === f
                        ? "bg-indigo-500 text-white"
                        : "bg-white ring-1 ring-gray-300 text-gray-600 hover:ring-indigo-300"
                    }`}
                  >
                    {formatLabels[f]}
                  </button>
                ))}
              </div>
            )}
            {missingFormat && (
              <p className="pl-6 text-xs text-red-500">Choose a lesson type.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubjectPicker;
