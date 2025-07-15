import Select from "react-select";
import { Controller } from "react-hook-form";
import { FieldError, UseFormReturn } from "react-hook-form";

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  options: Option[];
  isMulti?: boolean;
  control: UseFormReturn<any>["control"];
  error?: FieldError;
};

export default function ReactSelectField({
  name,
  label,
  options,
  isMulti = false,
  control,
  error,
}: Props) {
  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti={isMulti}
            onChange={(val) => {
              const value = isMulti
                ? (val as Option[]).map((v) => v.value)
                : (val as Option).value;
              field.onChange(value);
            }}
            value={
              isMulti
                ? options.filter((o) => (field.value || []).includes(o.value))
                : options.find((o) => o.value === field.value)
            }
          />
        )}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}
