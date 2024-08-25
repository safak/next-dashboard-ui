import Link from "next/link";
import Image from "next/image";

import Menu from "../../components/Menu";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex h-screen">
      {/* left */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-red-50 p-2">
        <Link
          href="/"
          className=" flex items-center justify-center gap-2 lg:justify-start"
        >
          <Image src="/logo.png" alt="logo" height={32} width={32} />
          <span className=" hidden lg:block">KepaSchool</span>
        </Link>
        <Menu />
      </div>
      {/* right */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:bg-[84%] bg-[#F7F8FA] overflow-scroll ">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
