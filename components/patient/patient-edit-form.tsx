'use client'

import { useState } from 'react'

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
import axios from 'axios'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { Textarea } from '@/components/ui/textarea'
import { RowActionsProps } from '@/types'


export function EditPatient<TData>({ row }: RowActionsProps<TData>) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AddPatientSchema>>({
    resolver: zodResolver(AddPatientSchema),
    defaultValues: {
      name: row.getValue("name"),
      roomNumber: row.getValue("roomNumber"),
      ward: row.getValue("ward"),
      admisDate: row.getValue("admisDate"),
      exceptedDate: row.getValue("exceptedDate"),
      reason: row.getValue("reason"),
      roomType: row.getValue("roomType"),
      nextOfKin: row.getValue("nextOfKin"),
      isStatus: row.getValue("isStatus"),
    },
  });
  const onSubmit = async (values: z.infer<typeof AddPatientSchema>) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/patient/${row.getValue("id")}`, values);
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
      <form className="ms-1.5 w-[325px] flex flex-col gap-5 pt-5 pb-14"
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="admisDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Admis Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={isLoading}
                              variant={"outline"}
                              className={cn(
                                "text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            disabled={isLoading}
                            initialFocus
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="exceptedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Except Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={isLoading}
                              variant={"outline"}
                              className={cn(
                                "text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            disabled={isLoading}
                            initialFocus
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        placeholder="Type your message here."
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="nextOfKin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next of kin</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
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
                      disabled={isLoading}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </>
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? <Spinner /> : "Update an Patient"}</Button>
      </form>
    </Form>
  )
}