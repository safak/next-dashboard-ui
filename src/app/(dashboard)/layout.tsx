import Menu from "@/components/Menu";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";

export default function dashboardLayout({
  children,
}:
 Readonly<{
  children: React.ReactNode;
}>) {
  return( <div className="h-screen flex ">
    {/* LEFT */}
    <div className="w-[14%] md:-[10%] lg:w-[16%] xl:w-[14%]  p-4 overflow-scroll">
      <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
      <Image src="/logo.png" alt="logo" width={32} height={32}></Image>
        <span className="hidden lg:block font-bold text-xl">CRESCITA LMS</span>
      </Link>
     <Menu/>
    </div>
    {/* RIGHT*/}
     <div className="w-[86%]  md:-[90%] lg:w-[84%] xl:w-[86%] bg-gray-100 overflow-scroll flex flex-col">
      <Navbar/>
      {children}
     </div>
    </div>
  );
}
