"use client";

import { useFormContext, Controller } from "react-hook-form";
import clsx from "clsx";

function getNestedValue(
  obj: Record<string, unknown> | undefined,
  path: string,
) {
  return path.split(".").reduce<any>((acc, key) => acc?.[key], obj);
}

type Props = {
  label?: string;
  type?: "text" | "number" | "email" | "password" | "textarea" | "phone";
  name: string;
  hidden?: boolean;
  className?: string;
  readOnly?: boolean;
};

export default function InputField({
  label,
  type = "text",
  name,
  hidden = false,
  className,
  readOnly = false,
}: Props) {
  const {
    register,
    control,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

  const fieldError = getNestedValue(errors, name);

  const error = fieldError?.message as string | undefined;

  const isTouched = Boolean(getNestedValue(touchedFields, name));
  const showError = Boolean(error && (isTouched || submitCount > 0));

  if (hidden) {
    return <input type="hidden" {...register(name)} />;
  }

  const baseInput =
    "w-full rounded-lg border px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-xs outline-none transition";

  const borderStyle = showError
    ? "border-red-500 focus:ring-red-100"
    : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const readOnlyStyle = "bg-gray-50 text-gray-600 cursor-not-allowed";

  const inputClass = clsx(baseInput, readOnly ? readOnlyStyle : borderStyle);

  const maskPhone = (digits: string) =>
    digits.replace(/^(\d{5})(\d{0,5}).*/, "$1 $2").trim();

  return (
    <div className={clsx("w-full space-y-1 relative", className)}>
      {label && (
        <label className="text-[8px] sm:text-[11px] font-bold text-gray-600">
          {label}
        </label>
      )}

      {readOnly && (
        <span className="absolute top-1 right-2 text-xs sm:text-[10px] bg-gray-100 text-gray-500 px-0.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
          Read only
        </span>
      )}

      {/* ===== PHONE INPUT (Controller) ===== */}
      {type === "phone" ? (
        <Controller
          name={name}
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (v) =>
              v?.length === 10 || "Phone must be exactly 10 digits",
          }}
          render={({ field }) => (
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Phone number"
              readOnly={readOnly}
              value={maskPhone(field.value || "")}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

                field.onChange(digits); // ⭐ store digits only
              }}
              className={inputClass}
            />
          )}
        />
      ) : type === "textarea" ? (
        <textarea
          {...register(name)}
          rows={3}
          readOnly={readOnly}
          className={inputClass}
        />
      ) : (
        <input
          {...register(
            name,
            type === "number" ? { valueAsNumber: true } : undefined,
          )}
          type={type}
          readOnly={readOnly}
          className={inputClass}
        />
      )}

      {showError && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
