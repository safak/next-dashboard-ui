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
import { Loader } from 'lucide-react'
import Image from 'next/image';
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { AddContentSchema } from '@/schemas/tables.schemas'
import { onContent } from '@/actions/content'


export const CreateContentForm = () => {
  const user = useCurrentUser();
  const { toast } = useToast();

  const router = useRouter();


  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState(null);

  const form = useForm<z.infer<typeof AddContentSchema>>({
    resolver: zodResolver(AddContentSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      backdrop: "",
      isStatus: true || undefined
    },
  });

  const onSubmit = (values: z.infer<typeof AddContentSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      onContent(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
        form.reset();
        router.refresh();
        window.location.reload();
    });
   
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      const data = new FormData();
      data.set('file', file);
      const res = await fetch('api/upload', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());

      imageRef.current && (imageRef.current.value = '');
    } catch (e) {
      console.error(e)
    }
  }

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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Youtube"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Type your message here."
                        rows={10}
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
                <div className="flex flex-col items-start w-full">
                  <div className="img_grid" onClick={() => imageRef?.current?.click()}>
                    <Input
                      type="file"
                      className="hidden"
                      ref={imageRef}
                      onChange={(e) => uploadImage(e)}
                    />
                    {!isImageLoading ? (
                      <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
                    ) : (
                      <div className="text-sm flex-center font-medium text-white-1">
                        Uploading...
                        <Spinner />
                        <Loader size={20} className="animate-spin ml-2" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-sm font-bold text-primary">
                        Click to upload
                      </h2>
                      <p className="text-xs font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
                    </div>
                  </div>
                  {/* {image && (
                    <div className="flex-center w-full">
                      <Image
                        src={image}
                        width={400}
                        height={400}
                        className="rounded-xl mt-5"
                        alt="thumbnail"
                      />
                    </div>
                  )} */}
                </div>
              </TabsContent>
              <TabsContent value="Web content">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="backdrop"
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
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>{isPending ? <Spinner /> : "Create Content"}</Button>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  )
}
