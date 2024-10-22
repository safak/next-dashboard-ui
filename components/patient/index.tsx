"use client";

import { SideSheet } from '@/components/sheet';
import { PlusCircle } from 'lucide-react'
import { CreatePatient } from './patient-create-form';
import { ScrollArea } from '@/components/ui/scroll-area';


export const AddPatients = () => {
    return (
        <div className="flex gap-2 justify-end">
            <SideSheet
                icon={<PlusCircle />}
                description="Add your Patients"
                title="Create a new patient"
                className="flex items-center gap-2 bg-greenlight px-2 py-1.5 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary"
                trigger={
                    <>
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Patient
                        </span>
                    </>
                }
            >
                <ScrollArea className='h-full w-[360px]'>
                    <CreatePatient />
                </ScrollArea>
            </SideSheet>
        </div>
    )
}