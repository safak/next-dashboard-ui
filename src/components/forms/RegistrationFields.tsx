import { FieldError, UseFormRegisterReturn } from "react-hook-form";

// Small building blocks shared by the student and parent sign-up forms

export const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <fieldset className="card p-5 md:p-6 flex flex-col gap-4">
    <div>
      <legend className="text-base font-semibold text-gray-800">{title}</legend>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </fieldset>
);

type FieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError | { message?: unknown };
  optional?: boolean;
  wide?: boolean;
  hint?: string;
};

const FieldShell = ({
  label,
  registration,
  error,
  optional,
  wide,
  hint,
  children,
}: FieldProps & { children: React.ReactNode }) => (
  <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
    <label
      htmlFor={registration.name}
      className="text-xs font-medium text-gray-600"
    >
      {label}
      {optional && <span className="text-gray-400 font-normal"> (optional)</span>}
    </label>
    {children}
    {hint && !error?.message && (
      <p className="text-xs text-gray-400">{hint}</p>
    )}
    {error?.message ? (
      <p className="text-xs text-red-500">{String(error.message)}</p>
    ) : null}
  </div>
);

export const TextField = ({
  type = "text",
  inputProps,
  ...props
}: FieldProps & {
  type?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) => (
  <FieldShell {...props}>
    <input
      id={props.registration.name}
      type={type}
      className="form-control"
      aria-invalid={!!props.error?.message}
      {...inputProps}
      {...props.registration}
    />
  </FieldShell>
);

export const SelectField = ({
  options,
  placeholder,
  ...props
}: FieldProps & {
  options: { value: string | number; label: string }[];
  placeholder: string;
}) => (
  <FieldShell {...props}>
    <select
      id={props.registration.name}
      className="form-control"
      defaultValue=""
      aria-invalid={!!props.error?.message}
      {...props.registration}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </FieldShell>
);

export const TextAreaField = (props: FieldProps & { placeholder?: string }) => (
  <FieldShell {...props}>
    <textarea
      id={props.registration.name}
      rows={3}
      placeholder={props.placeholder}
      className="form-control resize-y"
      {...props.registration}
    />
  </FieldShell>
);
