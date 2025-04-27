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
    <div className="h-screen flex">
        {/* LEFT */}
        <div className=" w-[14%] md:w-[8%] lg:w-[16%] p-4 "> 

          <Link href="/" className="flex items-center justify-center gap-2 lg:justify-start">
          
            <Image src="/logo2.png" alt="logo" width={32} height={32} /> 
            <span className="hidden bold lg:block  text-black p-2"> Aamusted</span>
          </Link>
          <Menu/>
        </div>
        
        
        {/* Right */}
        <div className="w-[86%] md:W-[92%] lg:w-[84%] bg-[#f7f8fa] overflow-scroll">
          <Navbar/>
          {children}

        </div>
        
        
        
    </div>
  ); 
}