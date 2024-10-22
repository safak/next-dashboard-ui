"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/auth/new-verification";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSuccess } from "@/components/forms/message/form-success";
import { FormError } from "@/components/forms/message/form-error";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Spinner } from "@/components/spinner";


export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-3xl">Verification</CardTitle>
        <CardDescription className="text-xs">
          Confirming your verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <>
          {!success && !error && (
            <Spinner />
          )}
          <FormSuccess message={success} />
          {!success && (
            <FormError message={error} />
          )}
        </>
        <Button
          size="sm"
          variant="link"
          asChild
          className="p-0 font-normal"
        >
          <Link href="/auth/sign-in" className="ml-auto inline-block text-sm underline">
            Back to login
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}