// app/dashboard/layout.tsx

import Link from 'next/link';
import Image from 'next/image';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import { auth } from '../../lib/auth';
import SessionWrapper from '../../components/SessionWrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  const isGuest = !user;

  return (
    <SessionWrapper session={session}>
      <div className="h-screen flex">
        {/* SIDEBAR */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
            <Image src="/uploads/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">KalasaMs</span>
          </Link>
          {!isGuest && <Menu />}
        </div>

        {/* MAIN CONTENT */}
        <div
          className={`${
            !isGuest ? 'w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]' : 'w-full'
          } bg-[#F7F8FA] overflow-scroll flex flex-col`}
        >
          <Navbar />
          {children}
        </div>
      </div>
    </SessionWrapper>
  );
}
