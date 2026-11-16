import { ForgotPasswordForm } from "@/components/forms/RecoveryForms";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Forgot password" };

const ForgotPasswordPage = async () => {
  const { role } = await auth();
  if (role) redirect(`/${role}`);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lamaSkyLight p-4">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
