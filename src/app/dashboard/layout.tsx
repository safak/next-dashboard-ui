import Menu from "@/components/Menu"; // Ensure the correct path to the `Menu` component
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[14%] xl:w-[14%] bg-[#0d1b2a] p-4">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold text-white">AspireAI</span>
        </Link>
        <Menu userType="student" /> {/* Hardcode userType as "student" */}
      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-white-200 overflow-scroll">
        <Navbar/>
        {children}
      </div>
    </div>
  );
}
