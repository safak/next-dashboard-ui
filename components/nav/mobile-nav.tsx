"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks, sidebarOptions } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"


const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section>
      <Sheet>
        <SheetTrigger asChild>
          <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-2">
          <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 pl-4">
            <Image src="/images/logo.png" alt="logo" width={23} height={27} />
            <h1 className="text-24 font-extrabold  text-white-1 ml-2">IDD Management</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
                <div className="flex flex-col">
                  <p className="text-xs text-graylight px-3 mb-3">MENU</p>
                  {sidebarLinks.map(({ route, label, imgURL }) => {
                    const isActive = pathname === route || pathname.startsWith(`${route}/`);

                    return <SheetClose asChild key={route}><Link href={route} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {
                      'bg-nav-focus border-r-4 border-greenlight': isActive
                    })}>
                      <Image src={imgURL} alt={label} width={24} height={24} />
                      <p>{label}</p>
                    </Link></SheetClose>
                  })}
                </div>
                <nav className="mt-auto flex flex-col gap-6 sm:py-5 pb-8">
                  <div className="flex flex-col">
                    <p className="text-xs text-graylight px-3 mb-3">OPTIONS</p>
                    {sidebarOptions.map(({ route, label, imgURL }) => {
                      const isActive = pathname === route || pathname.startsWith(`${route}/`);
                      return <SheetClose asChild key={route}><Link href={route} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {
                        'bg-nav-focus border-r-4 border-greenlight': isActive
                      })}>
                        <Image src={imgURL} alt={label} width={24} height={24} />
                        <p>{label}</p>
                      </Link></SheetClose>
                    })}
                  </div>
                  <div className="flex-center w-full pb-3 max-lg:px-4 lg:pr-8">
                    <Button className='text-16 w-full bg-graylight font-extrabold'>
                      Sign Out
                    </Button>
                  </div>
                </nav>
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>  
    </section>
  )
}

export default MobileNav