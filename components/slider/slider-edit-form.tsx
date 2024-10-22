'use client'

import React, { useRef, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TabsMenu from '@/components/tabs'
import { UPLOAD_TABS_MENU } from '@/constants/forms'
import { TabsContent } from '@radix-ui/react-tabs'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { FormError } from '@/components/forms/message/form-error'
import { FormSuccess } from '@/components/forms/message/form-success'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/spinner'
import { useCurrentUser } from '@/hooks/auth/sign-in/use-current-user'
import { Loader, X } from 'lucide-react'
import Image from 'next/image';
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { AddSliderSchema } from '@/schemas/tables.schemas'
import { onSlider } from '@/actions/slider'
import { OnShow } from '../tables/datatable/data'
import { Checkbox } from '../ui/checkbox'
import GenerateThumbnail from '../upload/generate-thumbnail'
import { SliderCardProps } from '@/types'
import axios from 'axios'


export const EditSliderForm = ({ name, image, isStatus, id }: SliderCardProps) => {
  const user = useCurrentUser();
  const { toast } = useToast();

  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddSliderSchema>>({
    resolver: zodResolver(AddSliderSchema),
    defaultValues: {
      name: name,
      image: image || undefined,
      onshow: "",
      isStatus: isStatus || undefined
    },
  });

  const onSubmit = async (values: z.infer<typeof AddSliderSchema>) => {
    try {
      await axios.patch(`/api/slider/${id}`, values);
      form.reset();
      router.refresh();
      window.location.reload();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form className="ms-1.5 w-[325px] flex flex-col gap-5 pt-5 pb-14"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <>
          <div className="flex flex-col gap-4">
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
                        disabled={isPending}
                        placeholder="Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <TabsMenu triggers={UPLOAD_TABS_MENU}>
              <TabsContent
                value="Upload files"
                className="flex flex-col items-start mt-3 w-full"
              >
                <GenerateThumbnail
                  image={image}
                  description='SVG, PNG, JPG, or GIF (max. 1920 × 1080px)'
                />
              </TabsContent>
              <TabsContent value="Web content">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URLs</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="https://"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </TabsMenu>
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
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>{isPending ? <Spinner /> : "Update"}</Button>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  )
}
