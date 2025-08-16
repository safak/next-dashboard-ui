import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import { getImagePath } from "@/lib/utils";
// import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Management Dashboard",
  description: "Professional School Management System",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="lg:min-w-[200px] lg:w-[15%] min-w-[70px] w-[10%] bg-white shadow-sm p-4 flex flex-col">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <Image
            src={getImagePath("/logo.png")}
            alt="Dashboard Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="hidden lg:block text-xl font-semibold">
            SchoolKishk
          </span>
        </Link>
        <div className="flex-1 overflow-hidden">
          <Menu />
        </div>
      </div>
      <div className="flex-1 bg-[#F7F8FA] overflow-scroll scrollbar-hide">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
