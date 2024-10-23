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
      <div className=" flex">
        <div className="w-[14%] md:w[8%] lg:w[16%] xl:w[14%]">
          <Link href="/" className="flex items-center justify-center gap-2 p-2">
            <Image src="/logo.png" alt="logo" width={30} height={30} />
            <span className="hidden lg:block"> School Mangaement </span>
          </Link>
          <Menu/>
        </div>
        <div className="w-[86%] md:w[92%] lg:w[84%] xl:w[86%] bg-[#F7F8FA] overflow-scroll" >
          <Navbar/>
          {children}
        </div>
      </div>
  );
}
