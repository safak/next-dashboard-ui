import SignInForm from "@/components/forms/SignInForm";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/schoolSettings";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { role } = await auth();
  if (role) redirect(`/${role}`);

  const { schoolName } = await getSettings();

  return (
    <div className="min-h-screen flex items-center justify-center bg-lamaSkyLight p-4">
      <SignInForm schoolName={schoolName} />
    </div>
  );
};

export default LoginPage;
