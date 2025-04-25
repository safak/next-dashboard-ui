"use client";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex ">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[16%] overflow-y-clip">
        <Link
          href="/"
          className="flex items-center justify-center gap-1 lg:justify-start p-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">SchooLama</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lgw-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
