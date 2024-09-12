import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-screen flex"> 
          {/* Left */}
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
              <Link href="/" className="flex items-center justify-center  lg:justify-start gap-2 p-4">
                <Image src="/logo.png" alt="logo" width={32} height={32}/>
                <span className="hidden lg:block">DojangNext</span>
              </Link>
              <Menu/>
            </div>
          {/* Right */}
            <div className="w-[86%] md:w-[92*] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
              <Navbar/>
              {children}
            </div>
        </div>
    );
  }
  