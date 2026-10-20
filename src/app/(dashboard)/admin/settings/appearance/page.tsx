"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("system");

  const themes = [
    {
      key: "light",
      label: "Light",
      description: "Use a bright interface",
      icon: Sun,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      key: "dark",
      label: "Dark",
      description: "Use a darker interface",
      icon: Moon,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
    },
    {
      key: "system",
      label: "System",
      description: "Follow your device settings",
      icon: Laptop,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">Appearance</h2>

        <p className="mt-1 text-sm text-slate-500">
          Customize how the application looks on your device
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themes.map(
            ({ key, label, description, icon: Icon, iconBg, iconColor }) => {
              const active = theme === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  className={[
                    "relative flex min-h-[130px] flex-col items-start rounded-xl border p-4 text-left transition",
                    active
                      ? "border-blue-300 bg-blue-50/70 ring-1 ring-blue-200"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {label}
                  </p>

                  <p className="mt-1 text-xs leading-4 text-slate-500">
                    {description}
                  </p>

                  {active && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
