import SignInForm from "@/components/forms/SignInForm";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSettings, siteContent } from "@/lib/schoolSettings";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in" };

const LoginPage = async () => {
  const { role } = await auth();
  if (role) redirect(`/${role}`);
  // A brand-new installation has no accounts yet
  if ((await prisma.user.count()) === 0) redirect("/setup");

  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-lamaSkyLight p-4">
      <SignInForm schoolName={settings.schoolName} logoUrl={siteContent(settings).logoUrl} />
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to the website
      </Link>
    </div>
  );
};

export default LoginPage;
