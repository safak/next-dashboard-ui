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
import { ScreenCardProps } from '@/types'
import axios from 'axios'

export const EditScreen = ({
  name,
  ipaddress,
  id }: ScreenCardProps) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AddScreenSchema>>({
    resolver: zodResolver(AddScreenSchema),
    defaultValues: {
      name: name,
      ipaddress: ipaddress,
    },
  });

  const onSubmit = async (values: z.infer<typeof AddScreenSchema>) => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/device/${id}`, values);
      form.reset();
      router.refresh();
      window.location.reload();

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? <Spinner /> : "Update"}</Button>
      </form>
    </Form>
  )
}