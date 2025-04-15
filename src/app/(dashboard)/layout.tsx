import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function DashbordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/*LEFT*/}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] ">
        <Link
          href="/"
          className="flex items-center justify-ceneter lg:justify-start gap-2 p-4 "
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">School-MS</span>
        </Link>
        <Menu />
      </div>

      {/*RIGHT*/}
      <div className="w-[86%] md:-[92%] lg:w-[84%] xl:w-[86%] bg-[#e3e7e8] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
