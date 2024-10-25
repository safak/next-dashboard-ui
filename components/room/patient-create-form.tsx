'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/spinner'
import { useRouter } from 'next/navigation'
import { AddPatientSchema } from '@/schemas/tables.schemas'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { Textarea } from '@/components/ui/textarea'
import { onCreatePatient } from '@/actions/patient'
import { FormError } from '@/components/forms/message/form-error'
import { FormSuccess } from '@/components/forms/message/form-success'

export const CreateRoom = () => {

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddPatientSchema>>({
    resolver: zodResolver(AddPatientSchema),
    defaultValues: {
      name: "",
      roomNumber: "",
      ward: "",
      admisDate: new Date,
      exceptedDate: new Date,
      reason: "",
      roomType: "",
      nextOfKin: "",
      isStatus: true || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof AddPatientSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      onCreatePatient(values)
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
      <form className="flex flex-col gap-5 pt-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="s-111"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
           
            <FormField
              control={form.control}
              name="isStatus"
              render={({ field }) => (
                <FormItem className={cn(field.value === true ? "flex flex-row items-center justify-between rounded-lg border border-primary p-3 shadow-sm" : "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm")}>
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>
                      Enable status is active
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      defaultChecked={true}
                      checked={field.value}
                      disabled={isPending}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </>
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>{isPending ? <Spinner /> : "Create Room"}</Button>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  )
}