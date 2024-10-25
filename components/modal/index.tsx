import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type Props = {
    trigger: React.ReactNode
    children: React.ReactNode
    title: string
    description: string
    classname?: string
    // type?: 'Integration'
    // logo?: string
}

const Modal = ({
    trigger,
    children,
    title,
    description,
    classname,
    //   type,
    //   logo,
}: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Modal