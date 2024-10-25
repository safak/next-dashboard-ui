'use client'

import { onUserRegistration } from "@/actions/auth";
import { UserRegistrationSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
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


export const CreateUser = () => {
    const userRole = UserRole;
    const router = useRouter();

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof UserRegistrationSchema>>({
        resolver: zodResolver(UserRegistrationSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
            role: userRole.USER || undefined,
            isTwoFactorEnabled: false || undefined,
            isStatus: true || undefined
        },
    });

    const onSubmit = (values: z.infer<typeof UserRegistrationSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            onUserRegistration(values)
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
                                                disabled={isPending}
                                                placeholder="John Doe"
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
                                                disabled={isPending}
                                                placeholder="john.doe@example.com"
                                                type="email"
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
                                                disabled={isPending}
                                                placeholder="******"
                                                type="password"
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
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="******"
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                </>
                <Button type="submit" className="w-full" size="lg" disabled={isPending}>{isPending ? <Spinner /> : "Create an account"}</Button>
                <FormError message={error} />
                <FormSuccess message={success} />
            </form>
        </Form>
    )

}
