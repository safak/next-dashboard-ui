'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'
import { Input } from '../ui/input'

type Props = {
    route: string,
  }

const Searchbar = ({route}: Props) => {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    const debouncedValue = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedValue) {
            router.push(`/${route}?search=${debouncedValue}`)
        } else if (!debouncedValue && pathname === `/${route}`) router.push(`/${route}`)
    }, [router, pathname, debouncedValue])

    return (
        <div className="relative mt-1 block">
            <Input
                className="input-class py-1 pl-9 lg:w-[350px] focus-visible:ring-offset-primary-1"
                placeholder="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch('')}
            />
            <Image
                src="/icons/search.svg"
                alt="search"
                height={25}
                width={25}
                className="absolute left-2 top-1.5"
            />
        </div>
    )
}

export default Searchbar