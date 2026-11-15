"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { DeliveryMode, LessonFormat } from "@prisma/client";
import { saveFeeRates } from "@/lib/feeActions";
import { formatLabels, formatsFor, LESSON_FORMATS } from "@/lib/subjectDelivery";

type Row = { subjectId: number | null; name: string; delivery: DeliveryMode | null };
const key = (subjectId: number | null, format: LessonFormat) => `${subjectId ?? "default"}:${format}`;

// Monthly fee per subject and lesson type. The top row is the default used
// by any subject left empty.
const FeeRatesGrid = ({
  rows,
  initial,
}: {
  rows: Row[];
  initial: Record<string, string>;
}) => {
  const [values, setValues] = useState(initial);
  const [state, action, pending] = useActionState(saveFeeRates, { success: false, error: false });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast("Fee rates saved.");
      router.refresh();
    }
  }, [state, router]);

  const save = () =>
    startTransition(() =>
      action({
        rates: rows.flatMap((r) =>
          LESSON_FORMATS.map((f) => ({
            subjectId: r.subjectId,
            format: f,
            amount: (values[key(r.subjectId, f)] ?? "").trim(),
          }))
        ),
      })
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-2 pr-3 font-medium">Subject</th>
              {LESSON_FORMATS.map((f) => (
                <th key={f} className="py-2 px-2 font-medium">{formatLabels[f]} (R/month)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const offered = r.delivery ? formatsFor(r.delivery) : LESSON_FORMATS;
              return (
                <tr key={r.subjectId ?? "default"} className={`border-t border-gray-100 ${r.subjectId === null ? "bg-lamaSkyLight/60" : ""}`}>
                  <td className="py-2 pr-3">
                    <span className={r.subjectId === null ? "font-semibold" : ""}>{r.name}</span>
                  </td>
                  {LESSON_FORMATS.map((f) => {
                    const k = key(r.subjectId, f);
                    const available = offered.includes(f);
                    return (
                      <td key={f} className="py-1.5 px-2">
                        {available ? (
                          <input
                            aria-label={`${r.name} ${formatLabels[f]} monthly fee`}
                            inputMode="decimal"
                            value={values[k] ?? ""}
                            placeholder={r.subjectId === null ? "—" : "default"}
                            onChange={(e) => setValues({ ...values, [k]: e.target.value })}
                            className="form-control py-1.5"
                          />
                        ) : (
                          <span className="text-xs text-gray-300" title="Not offered for this subject">n/a</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        Leave a subject&apos;s cell empty to use the default in the top row. &quot;n/a&quot;
        means the subject isn&apos;t offered that way.
      </p>
      {state.error && <p className="text-sm text-red-500">{state.message}</p>}
      <button type="button" onClick={save} className="btn-primary self-start" disabled={pending}>
        {pending ? "Saving..." : "Save fee rates"}
      </button>
    </div>
  );
};

export default FeeRatesGrid;
