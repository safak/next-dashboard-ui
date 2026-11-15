import { auth } from "@/lib/auth";
import { getSettings, siteContent } from "@/lib/schoolSettings";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const RegisterLayout = async ({ children }: { children: React.ReactNode }) => {
  const { role } = await auth();
  if (role) redirect(`/${role}`);

  const settings = await getSettings();
  const { schoolName } = settings;

  return (
    <div className="min-h-screen bg-lamaSkyLight px-4 py-8">
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image src={siteContent(settings).logoUrl} alt="" width={32} height={32} unoptimized className="h-8 w-8 object-contain" />
          <span className="font-semibold text-gray-800">{schoolName}</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default RegisterLayout;
