import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { getSettings, siteContent } from "@/lib/schoolSettings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = await auth();
  // The cookie looked valid to the proxy, but the account is gone or the
  // session was revoked by a password change
  if (!role) redirect("/sign-in");
  const homeHref = role ? `/${role}` : "/";
  const settings = await getSettings();
  const { schoolName } = settings;

  return (
    <div className="h-screen flex">
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] h-full overflow-y-auto bg-white border-r border-gray-100 px-2 lg:px-4 py-4">
        <Link
          href={homeHref}
          className="flex items-center justify-center lg:justify-start gap-2 lg:px-3"
        >
          <Image src={siteContent(settings).logoUrl} alt="logo" width={32} height={32} unoptimized className="h-8 w-8 object-contain" />
          <span className="hidden lg:block font-semibold text-gray-800">
            {schoolName}
          </span>
        </Link>
        <Menu />
      </aside>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-auto flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
