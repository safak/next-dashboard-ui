'use client'

import React, { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { FieldErrors, FieldValues, useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { AddSliderSchema } from '@/schemas/tables.schemas'
import { onSlider } from '@/actions/slider'
import UploadButton from '@/components/upload-button'
import Section from '@/components/section-label'
import Image from "next/image"
import TabsMenu from '../tabs'
import { TabsContent } from '../ui/tabs'
import GenerateThumbnail from '../upload/generate-thumbnail'
import { UPLOAD_TABS_MENU } from '@/constants/forms'


type Props = {
    register: UseFormRegister<FieldValues>
    errors: FieldErrors<FieldValues>
}

export const GeneralSettingForm = ({ register, errors }: Props) => {
    const router = useRouter();

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof AddSliderSchema>>({
        resolver: zodResolver(AddSliderSchema),
        defaultValues: {
            name: "",
            image: "",
            onshow: "",
            isStatus: true || undefined
        },
    });

    const onSubmit = async (values: z.infer<typeof AddSliderSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            onSlider(values)
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className='flex flex-col gap-2'>
                    <p className="text-sm font-medium pt-8">
                        Logo Application
                    </p>
                    <UploadButton
                        register={register}
                        errors={errors}
                        label="Edit Logo"
                        labelR='Recommended size is 300px * 300px, size less than 2MB'
                    />
                    <span className="text-sm font-light text-muted-foreground">
                        This is your public display logo. It can be your real logo. You can only change this once everywhere.
                    </span>
                </div>
                
                <div className='flex flex-col gap-2'>
                    <p className="text-sm font-medium pt-2">
                        Application background
                    </p>
                    <TabsMenu triggers={UPLOAD_TABS_MENU}>
                        <TabsContent
                            value="Upload files"
                            className="flex flex-col items-start mt-3 w-full"
                        >
                            <GenerateThumbnail
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
                    <span className="text-sm font-light text-muted-foreground">
                        This is your public display image. It can be your real image to application backgroud. You can only change this once everywhere.
                    </span>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className="text-sm font-medium pt-2">
                        Hospital Information background
                    </p>
                    <TabsMenu triggers={UPLOAD_TABS_MENU}>
                        <TabsContent
                            value="Upload files"
                            className="flex flex-col items-start mt-3 w-full"
                        >
                            <GenerateThumbnail
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
                    <span className="text-sm font-light text-muted-foreground">
                        This is your public display image. It can be your real image to hospital information backgroud. You can only change this once everywhere.
                    </span>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className="text-sm font-medium pt-2">
                        Patient Information background
                    </p>
                    <TabsMenu triggers={UPLOAD_TABS_MENU}>
                        <TabsContent
                            value="Upload files"
                            className="flex flex-col items-start mt-3 w-full"
                        >
                            <GenerateThumbnail
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
                    <span className="text-sm font-light text-muted-foreground">
                        This is your public display image. It can be your real image to Patient information backgroud. You can only change this once everywhere.
                    </span>
                </div>
                <Button type="submit">Update</Button>
            </form>
        </Form>
    )
}
