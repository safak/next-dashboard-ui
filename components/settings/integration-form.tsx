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


export const IntegrationSettingForm = () => {
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
                <div className='flex flex-col gap-2 pt-8'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>APIs service</FormLabel>
                                <FormDescription>
                                Add APIs links to your patients.
                                </FormDescription>
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
                <Button type="submit">Update</Button>
            </form>
        </Form>
    )
}
