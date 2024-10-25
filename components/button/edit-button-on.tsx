
import React from 'react'
import { Hint } from '@/components/tootips'
import Image from 'next/image'

export const EditButtonOn = () => {
    return (
        <div>
            <Hint
                side="top"
                align="center"
                label="Edit"
            >
                <Image src="/icons/edit.svg" alt="edit" className="hidden group-hover:block ease-in-out transition hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer" width={20} height={20} />
            </Hint>
        </div>
    )
}