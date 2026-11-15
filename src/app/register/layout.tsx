import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/schoolSettings";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const RegisterLayout = async ({ children }: { children: React.ReactNode }) => {
  const { role } = await auth();
  if (role) redirect(`/${role}`);

  const { schoolName } = await getSettings();

  return (
    <div className="min-h-screen bg-lamaSkyLight px-4 py-8">
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image src="/logo.png" alt="" width={32} height={32} />
          <span className="font-semibold text-gray-800">{schoolName}</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default RegisterLayout;
