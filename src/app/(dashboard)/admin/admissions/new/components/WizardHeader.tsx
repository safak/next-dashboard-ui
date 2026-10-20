"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface WizardHeaderProps {
  currentStep: number;
  steps: Step[];
}

export default function WizardHeader({
  currentStep,
  steps,
}: WizardHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-start">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step.title}
              className="contents"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200",
                    completed &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    active &&
                      "border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-200",
                    !completed &&
                      !active &&
                      "border-slate-300 bg-white text-slate-500",
                  )}
                >
                  {completed ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    index + 1
                  )}
                </div>

                <p
                  className={cn(
                    "mt-1.5 text-sm font-semibold leading-tight",
                    completed && "text-emerald-700",
                    active && "text-sky-700",
                    !completed &&
                      !active &&
                      "text-slate-600",
                  )}
                >
                  {step.title}
                </p>

                <p className="mt-0.5 whitespace-nowrap text-[10px] leading-tight text-slate-400">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-center px-3 pt-4">
                  <div
                    className={cn(
                      "h-0.5 w-full min-w-[40px] rounded-full transition-colors duration-200",
                      index < currentStep
                        ? "bg-emerald-400"
                        : "bg-slate-200",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}