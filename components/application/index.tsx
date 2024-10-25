"use client";

import { SideSheet } from '@/components/sheet';
import { PlusCircle } from 'lucide-react'
import { CreateAppForm } from '@/components/application/app-create-form';
import { addapp } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

const AddApps = () => {
    return (
        <div className="flex gap-2 justify-end">
            <SideSheet
                icon={<PlusCircle />}
                description="Add your apps"
                title="Create a new apps"
                className="flex items-center gap-2 bg-greenlight px-3 py-3 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary"
                trigger={
                    <>
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add App
                        </span>
                    </>
                }
            >
                <ScrollArea className='h-full w-[360px]'>
                    <CreateAppForm />
                </ScrollArea>
            </SideSheet>
        </div>
    )
}

export default AddApps