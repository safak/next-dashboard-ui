"use client";

import { SideSheet } from '@/components/sheet';
import { PlusCircle } from 'lucide-react'
import { CreateSliderForm } from './slider-create-form';

const AddSlider = () => {
    return (
        <div className="flex gap-2 justify-end">
            <SideSheet
                icon={<PlusCircle />}
                description="Add your slider"
                title="Create a new slider"
                className="flex items-center gap-2 bg-greenlight px-3 py-3 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary"
                trigger={
                    <>
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Slider
                        </span>
                    </>
                }
            >
                <CreateSliderForm />
            </SideSheet>
        </div>
    )
}

export default AddSlider