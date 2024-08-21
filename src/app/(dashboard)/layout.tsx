import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="h-screen flex">
        {/* left side */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link href='/' className="flex items-center justify-center lg:justify-start gap-2">
            
            <Image
            src='/logo.png'
            alt="logo"
            width={32}
            height={32}
            />
            <span className="hidden lg:block font-bold">SchoolManagemnt</span>
          </Link>
         <Menu/>
        </div>
        {/* right */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
          <NavBar/>
          {children}
          </div>
      </div>
    );
  }