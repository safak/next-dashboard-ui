"use client";

import { Dispatch, SetStateAction } from "react";
import { User } from "lucide-react";
import { useFormContext } from "react-hook-form";

import InputField from "@/components/InputField";
import RadixDOBPicker from "@/components/ui/RadixDOBPicker";
import RadixSelect from "@/components/ui/RadixSelect";

import StudentPhoto from "./StudentPhoto";

import { StudentFormValues } from "@/lib/formValidationSchemas";

interface StudentInformationProps {
  img: any;
  setImg: Dispatch<SetStateAction<any>>;

  prefix?: string;
}

export default function StudentInformation({
  img,
  setImg,
}: StudentInformationProps) {
  const { watch, setValue } = useFormContext<StudentFormValues>();

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ================= Section Header ================= */}

      <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
          <User className="h-5 w-5 text-sky-700" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Personal Information
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Basic student profile and contact details.
          </p>
        </div>
      </div>

      {/* ================= Form Body ================= */}

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 md:grid-cols-2">
        {/* First Name */}

        <InputField label="First Name *" name="name" />

        {/* Last Name */}

        <InputField label="Last Name *" name="surname" />

        {/* Blood Group */}

        <InputField label="Blood Group" name="bloodType" />

        {/* Gender */}

        <div>
          <label className="mb-2 mt-1 block text-[8px] font-bold text-gray-600 sm:text-[11px]">
            Gender
          </label>

          <RadixSelect
            value={watch("sex")}
            onChange={(value) =>
              setValue("sex", value as StudentFormValues["sex"], {
                shouldValidate: true,
              })
            }
            options={[
              {
                value: "MALE",
                label: "Male",
              },
              {
                value: "FEMALE",
                label: "Female",
              },
            ]}
          />
        </div>

        {/* Date of Birth */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-[8px] font-bold text-gray-600 sm:text-[11px]">
            Date of Birth
          </label>

          <RadixDOBPicker
            value={watch("birthday")}
            onChange={(date) =>
              setValue("birthday", date, {
                shouldValidate: true,
              })
            }
          />
        </div>

        {/* Student Photo */}

        <StudentPhoto img={img} setImg={setImg} />
      </div>
    </section>
  );
}