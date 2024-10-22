import { EmptyStateProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

const EmptyState = ({ title, search, buttonLink, buttonText }: EmptyStateProps) => {
    return (
        <section className="flex-center size-full flex-col gap-3 py-56">
            <div className="flex flex-col gap-5 p-2 items-center">
            <Image
                src="/icons/empty.svg"
                width={50}
                height={50}
                alt="empty state"
            />
            </div>
            <div className="flex-center w-full flex-col gap-3">
                <h1 className="text-16 text-center font-medium text-muted-foreground">{title}</h1>
                {search && (
                    <p className="text-16 text-center font-medium text-muted-foreground">Try adjusting your search to find what you are looking for</p>
                )}
                {buttonLink && (
                    <Button className="bg-primary">
                        <Link href={buttonLink} className="gap-1 flex">
                            <>
                                <PlusCircle
                                    size={20}
                                    className="text-muted-foreground"
                                />
                            </>
                            <h1 className="text-16 font-extrabold text-muted-foreground">{buttonText}</h1>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    )
}

export default EmptyState