'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks, sidebarOptions } from '@/constants';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const Sidebar = () => {
    const pathname = usePathname();

    return (
        
        <section className={cn('left_sidebar h-[calc(100vh-5px]', { 'h-screen': "'h-[calc(100vh-140px)]'" })}>
            <nav className="flex flex-col gap-6">
                <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={27}
                        height={27}
                    />
                    <h1 className='text-24 font-extrabold text-white max-lg:hidden'>
                        IDE Management
                    </h1>
                </Link>
                <div className="flex flex-col">
                    <p className="text-xs text-graylight px-3 mb-3">MENU</p>
                    {sidebarLinks.map(({ route, label, imgURL }) => {
                        const isActive = pathname === route || pathname.startsWith(`${route}/`);
                        return <Link href={route} key={label} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start"
                            , { 'bg-nav-focus border-r-4 border-greenlight': isActive }
                        )}>
                            <Image src={imgURL} alt={label} width={24} height={24} />
                            <p>{label}</p>
                        </Link>
                    })}
                </div>
            </nav>
            <nav className="mt-auto flex flex-col gap-4 sm:py-5">
                <div className="flex flex-col">
                    <p className="text-xs text-graylight px-3 mb-3">OPTIONS</p>
                    {sidebarOptions.map(({ route, label, imgURL }) => {
                        const isActive = pathname === route || pathname.startsWith(`${route}/`);
                        return <Link href={route} key={label} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start"
                            , { 'bg-nav-focus border-r-4 border-greenlight': isActive }
                        )}>
                            <Image src={imgURL} alt={label} width={24} height={24} />
                            <p>{label}</p>
                        </Link>
                    })}
                </div>
                <div className="flex-center w-full pb-3 max-lg:px-4 lg:pr-8">
                    <Button className='text-16 w-full bg-graylight font-extrabold'>
                        Sign Out
                    </Button>
                </div>
            </nav>
        </section>
    );
};

export default Sidebar;
