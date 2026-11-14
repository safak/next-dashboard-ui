type SelectFieldProps = {
  label: string;
  register: any;
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue?: string | number;
  error?: { message?: unknown };
  placeholder?: string;
};

const SelectField = ({
  label,
  register,
  name,
  options,
  defaultValue,
  error,
  placeholder,
}: SelectFieldProps) => {
  const errorMessage = error?.message ? String(error.message) : null;

  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <select
        className="form-control"
        {...register(name)}
        defaultValue={defaultValue ?? ""}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
};

export default SelectField;
