import SetupForm from "@/components/forms/SetupForm";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Set up your school" };
export const dynamic = "force-dynamic";

// First-run setup for a brand-new installation
const SetupPage = async () => {
  if ((await prisma.user.count()) > 0) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-lamaSkyLight px-4 py-10">
      <div className="mx-auto max-w-xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Set up your school</h1>
          <p className="mt-1 text-sm text-gray-600">
            This is a new installation. Create the first administrator account and the
            basics; everything else is configured from Settings afterwards.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
};

export default SetupPage;
