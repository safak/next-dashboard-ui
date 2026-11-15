"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { messageSchema, MessageSchema } from "@/lib/formValidationSchemas";
import { sendMessage } from "@/lib/actions";
import { useFormAction } from "./useFormAction";

const MessageForm = ({
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
  });

  // Messages are only ever created; "update" never applies
  const { submit, pending, errorMessage } = useFormAction(sendMessage, {
    entity: "Message",
    type: "create",
    setOpen,
  });

  const { contacts } = relatedData;
  const isReply = !!data?.receiverId;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
      <h1 className="text-xl font-semibold">
        {isReply ? "Reply" : "New message"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <SelectField
          label="To"
          name="receiverId"
          register={register}
          defaultValue={data?.receiverId}
          error={errors?.receiverId}
          placeholder="Select a recipient"
          options={contacts.map(
            (c: { id: string; name: string; role: string }) => ({
              value: c.id,
              label: `${c.name} (${c.role})`,
            })
          )}
        />
        <InputField
          label="Subject"
          name="subject"
          defaultValue={data?.subject}
          register={register}
          error={errors?.subject}
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-500">Message</label>
          <textarea
            rows={6}
            className="form-control resize-y"
            {...register("body")}
          />
          {errors.body?.message && (
            <p className="text-xs text-red-400">{errors.body.message}</p>
          )}
        </div>
      </div>
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      <button className="btn-primary" disabled={pending}>
        Send
      </button>
    </form>
  );
};

export default MessageForm;
