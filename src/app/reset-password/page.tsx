import { ResetWithLinkForm } from "@/components/forms/RecoveryForms";
import { findResetToken } from "@/lib/passwordReset";
import Link from "next/link";

export const metadata = { title: "Choose a new password" };

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const { token = "" } = await searchParams;
  const reset = await findResetToken(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lamaSkyLight p-4">
      {reset ? (
        <ResetWithLinkForm token={token} username={reset.user.username} />
      ) : (
        <div className="card w-full max-w-sm p-8 flex flex-col gap-4 text-center">
          <h1 className="text-xl font-semibold text-gray-800">This link has expired</h1>
          <p className="text-sm text-gray-500">
            Reset links work once and only for 30 minutes. Ask for a new one and use the
            newest email.
          </p>
          <Link href="/forgot-password" className="btn-primary">
            Send a new link
          </Link>
          <Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-700">
            Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
