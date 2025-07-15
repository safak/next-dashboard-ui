import { FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input"

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  error?: FieldError;
  hidden?: boolean;
  placeholder?: null,
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  error,
  hidden,
  placeholder,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
     {/*  <label className="text-xs text-gray-500">{label}</label> */}
      <Input
        type={type}
        placeholder={label}
        {...register(name)}
        //className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
