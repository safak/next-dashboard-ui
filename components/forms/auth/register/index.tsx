"use client";

import { SideSheet } from '@/components/sheet';
import { PlusCircle } from 'lucide-react'
import { CreateUser } from '@/components/forms/auth/register/register-create-form';
import { ScrollArea } from '@/components/ui/scroll-area';


const AddUser = () => {
    return (
        <div className="flex gap-2 justify-end">
            <div className="flex-1 flex justify-end">
                <SideSheet
                    icon={<PlusCircle />}
                    title="Account details"
                    description="Enter your email and password"
                    className="flex items-center gap-2 bg-greenlight px-2 py-1.5 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary"
                    trigger={
                        <>
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Create account
                            </span>
                        </>
                    }
                >
                    <ScrollArea className='h-full w-[360px]'>
                        <CreateUser />
                    </ScrollArea>
                </SideSheet>
            </div>
        </div>

    )
}

export default AddUser