import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

import "../globals.css";
import Navbar from '../../components/Navbar';
import Menu from "@/components/Menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev School Management Dashboard",
  description: "Next.js School Management System",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex">
      {/* left */}
      <div className="w-[14%] md:w-[8%] lg:w-[14%] xl:w-[14%] p-4">
        <Link href={"/"} className="flex items-center justify-center gap-2 lg:justify-start">
          <Image src="/logo.png" alt="logo" width={32} height={32}/>
          <span className="hidden lg:block">Kitabu Inc.</span>
        </Link>
        <Menu/>
      </div>
      {/* Right */}
      <div className="w-[86%] md:w-[92%] lg:w-[86%] xl:w-[86%] bg-[#F7F8FA]">
        <Navbar/>
        {children}
      </div>
    </div>
  );
}
