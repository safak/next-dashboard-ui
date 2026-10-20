"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  loading?: boolean;
  canSubmit?: boolean;
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  loading = false,
  canSubmit = true,
}: WizardNavigationProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between">
      {/* Previous */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst || loading}
        className="
          inline-flex items-center gap-2
          rounded-lg border border-slate-200
          px-5 py-2.5
          text-sm font-medium text-slate-700
          transition-all
          hover:bg-slate-50
          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </button>

      {/* Step Counter */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">
          Step {currentStep + 1} of {totalSteps}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
        </p>
      </div>

      {/* Next / Submit */}
      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="
            inline-flex items-center gap-2
            rounded-lg
            bg-sky-600
            px-5 py-2.5
            text-sm font-medium text-white
            transition-all
            hover:bg-sky-700
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            console.log("BUTTON CLICKED");
            onSubmit();
          }}
          disabled={!canSubmit || loading}
          className="
    inline-flex items-center gap-2
    rounded-lg
    bg-emerald-600
    px-5 py-2.5
    text-sm font-medium text-white
    hover:bg-emerald-700
    disabled:pointer-events-none
    disabled:opacity-50
  "
        >
          Complete Admission
        </button>
      )}
    </div>
  );
}
