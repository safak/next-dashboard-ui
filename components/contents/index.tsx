"use client";

import { SideSheet } from '@/components/sheet';
import { PlusCircle } from 'lucide-react'
import { CreateAppForm } from '@/components/application/app-create-form';
import { addContent } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateContentForm } from './content-create-form';

const AddContent = () => {
    return (
        <div className="flex gap-2 justify-end">
            <SideSheet
                icon={<PlusCircle />}
                description="Add your content"
                title="Create a new content"
                className="flex items-center gap-2 bg-greenlight px-3 py-3 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary"
                trigger={
                    <>
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Content
                        </span>
                    </>
                }
            >
                <ScrollArea className='h-full w-[360px]'>
                    <CreateContentForm />
                </ScrollArea>
            </SideSheet>
        </div>
    )
}

export default AddContent