import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      <div
        className={" p-4 w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]"}
      >
        <Link
          href={"/"}
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image width={30} height={30} src={"/logo.png"} alt="logo image" />
          <span className=" hidden lg:block text-sm">School Portal</span>
        </Link>
        <Menu />
      </div>
      <div className={"w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll"}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
