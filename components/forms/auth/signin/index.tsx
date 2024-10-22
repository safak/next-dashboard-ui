"use client";

import { useForm } from "react-hook-form";
import { UserLoginSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { onLoginUser } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormError } from "@/components/forms/message/form-error";
import { FormSuccess } from "@/components/forms/message/form-success";


export const SignIn = () => {
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const form = useForm<z.infer<typeof UserLoginSchema>>({
        resolver: zodResolver(UserLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof UserLoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            onLoginUser(values, callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                    }

                    if (data?.success) {
                        form.reset();
                        setSuccess(data.success);
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true);
                    }
                })
                .catch(() => setError("Something went wrong"));
        });
    }
    return (
        <Card className="mx-auto max-w-sm">
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <CardHeader>
                <CardTitle className="text-3xl">Login</CardTitle>
                <CardDescription className="text-xs">
                    Enter your email or another service to your account
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form className="h-full"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <CardContent>
                        <div className="grid gap-4">
                            {showTwoFactor && (
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Two Factor Code</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="123456"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                            {!showTwoFactor && (
                                <>
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
                                                    <Button
                                                        size="sm"
                                                        variant="link"
                                                        asChild
                                                        className="p-0 font-normal"
                                                    >
                                                        <Link href="/auth/reset" className="ml-auto inline-block text-sm underline">
                                                            Forgot password?
                                                        </Link>
                                                    </Button>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" size="lg" disabled={isPending}>{showTwoFactor ? "Confirm" : "Sign in"}</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}