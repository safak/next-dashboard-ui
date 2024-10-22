import MobileNav from '@/components/nav/mobile-nav'
import NavHeading from '@/components/nav/nav-heading'
import Sidebar from '@/components/nav/sidebar'
import { UserNav } from '@/components/nav/usernav'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Toaster } from '@/components/ui/sonner'
import Image from "next/image";
import Link from 'next/link'
import { format } from "date-fns"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="scrollbar-thin max-h-screen w-full overflow-y-scroll">
        <nav className="sticky top-0 z-10 flex w-full items-center justify-between border-b px-3 py-4 bg-cream dark:bg-black-1 md:py-5">
          <NavHeading />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <UserNav />
          </div>
        </nav>
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image
                src="/images/logo.png"
                width={30}
                height={30}
                alt="menu icon"
              />
              <MobileNav />
            </div>
            <div className="wrapper">
              <Toaster />
              {children}
            </div>
          </div>
          {/* <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {format(Date.now(), "yyyy")} IDD IPTV MANAGEMENT
            </p>
            <Link href="/?admin=true" className="text-greenlight">
              Admin
            </Link>
          </div> */}
        </section>

      </div>
    </div>
  )
}