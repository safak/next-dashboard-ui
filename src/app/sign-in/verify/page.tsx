import { VerifyCodeForm } from "@/components/forms/RecoveryForms";
import { auth } from "@/lib/auth";
import { maskEmail } from "@/lib/email";
import { pendingSignIn } from "@/lib/emailCodes";
import { redirect } from "next/navigation";

export const metadata = { title: "Enter your sign-in code" };

// Second step of signing in for accounts with two-step sign-in switched on
const VerifyPage = async () => {
  const { role } = await auth();
  if (role) redirect(`/${role}`);

  const pending = await pendingSignIn();
  if (!pending) redirect("/sign-in");

  return (
    <div className="min-h-screen flex items-center justify-center bg-lamaSkyLight p-4">
      <VerifyCodeForm email={maskEmail(pending.email)} />
    </div>
  );
};

export default VerifyPage;
