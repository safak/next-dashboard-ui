import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const homeHref = role ? `/${role}` : "/";

  return (
    <div className="h-screen flex">
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] h-full overflow-y-auto bg-white border-r border-gray-100 px-2 lg:px-4 py-4">
        <Link
          href={homeHref}
          className="flex items-center justify-center lg:justify-start gap-2 lg:px-3"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-semibold text-gray-800">
            School Name
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
