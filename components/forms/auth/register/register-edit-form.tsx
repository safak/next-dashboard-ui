'use client'

import { ProfileSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSuccess } from "../../message/form-success";
import { FormError } from "../../message/form-error";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/sign-in/use-current-user";
import { updateUser } from "@/actions/auth/profile";
import { useSession } from "next-auth/react";
import { UsersProps } from "@/types/index";
import axios from "axios";


export const EditUser = ({ name, email, role, image, isTwoFactorEnabled, isStatus, id }: UsersProps) => {
    const user = useCurrentUser();
    const { update } = useSession();

    const router = useRouter();

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            image: undefined,
            password: undefined,
            newPassword: undefined,
            name: "",
            email: "",
            role: role,
            isTwoFactorEnabled: true || undefined,
            isStatus: true || undefined
        },
    });

    useEffect(() => {
        form.setValue("image", image);
        form.setValue("name", name);
        form.setValue("email", email);
        form.setValue("role", role);
        form.setValue("isTwoFactorEnabled", isTwoFactorEnabled);
        form.setValue("isStatus", isStatus);
      }, [form])

      
    const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
        try {
            console.log("Submit", values)
            await axios.patch(`/api/register/${id}`,
                { values });
            form.reset();
            window.location.reload();      
        } catch (error) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <Form {...form}>
            <form
                className="ms-1.5 w-[325px] flex flex-col gap-5 pt-5 pb-16"
                onSubmit={form.handleSubmit(onSubmit)}
            >
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
                                            placeholder="John Doe"
                                            disabled={isPending}
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                            disabled={isPending}
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                            disabled={isPending}
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
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                            disabled={isPending}
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
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={UserRole.ADMIN}>
                                                Admin
                                            </SelectItem>
                                            <SelectItem value={UserRole.USER}>
                                                User
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
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
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem className={cn(field.value === true ? "flex flex-row items-center justify-between rounded-lg border border-primary p-3 shadow-sm" : "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm")}>
                                    <div className="space-y-0.5">
                                        <FormLabel>Two Factor Authentication</FormLabel>
                                        <FormDescription>
                                            Enable two factor authentication for your account
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            disabled={isPending}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                    disabled={isPending}
                    type="submit"
                >
                    {isPending ? <Spinner /> : "Update User"}
                </Button>
            </form>
        </Form>
    )
}
