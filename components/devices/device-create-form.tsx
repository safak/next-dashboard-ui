'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/spinner'
import { useRouter } from 'next/navigation'
import { AddScreenSchema } from '@/schemas/tables.schemas'
import { FormError } from '@/components/forms/message/form-error'
import { FormSuccess } from '@/components/forms/message/form-success'
import { onCreateScreen } from '@/actions/device'

export const CreateScreen = () => {

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddScreenSchema>>({
    resolver: zodResolver(AddScreenSchema),
    defaultValues: {
      name: "",
      ipaddress: ""
    },
  });

  const onSubmit = (values: z.infer<typeof AddScreenSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      onCreateScreen(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
      form.reset();
      router.refresh();
      window.location.reload();
    });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <>
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="grid gap-2 w-full">
              <FormField
                control={form.control}
                name="ipaddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="127.0.0.1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="device-01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </>
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>{isPending ? <Spinner /> : "Create Screen"}</Button>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  )
}